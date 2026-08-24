export const SESSION_COOKIE = "whw_session";

export type SiteSession = {
  kind: "member" | "admin";
  userId: string;
  email: string;
  fullName: string;
  expiresAt: number;
};

const encoder = new TextEncoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array | null {
  try {
    const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

async function signature(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return bytesToBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

export async function signSiteSession(session: SiteSession, secret: string): Promise<string> {
  if (secret.length < 32) throw new Error("AUTH_SECRET is not configured securely.");
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify(session)));
  return `${payload}.${await signature(payload, secret)}`;
}

export async function verifySiteSession(token: string | null, secret: string | undefined): Promise<SiteSession | null> {
  if (!token || !secret || secret.length < 32) return null;
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra) return null;
  if (!safeEqual(await signature(payload, secret), suppliedSignature)) return null;
  const bytes = base64UrlToBytes(payload);
  if (!bytes) return null;
  try {
    const session = JSON.parse(new TextDecoder().decode(bytes)) as SiteSession;
    if (!session || !["member", "admin"].includes(session.kind) || !session.userId || !session.email || session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function sessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  for (const item of cookieHeader.split(";")) {
    const [name, ...valueParts] = item.trim().split("=");
    if (name === SESSION_COOKIE) return valueParts.join("=") || null;
  }
  return null;
}

export function sessionCookie(token: string, maxAge = 31_536_000): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function signUnsubscribeToken(userId: string, email: string, secret: string): Promise<string> {
  if (secret.length < 32) throw new Error("AUTH_SECRET is not configured securely.");
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify({ purpose: "unsubscribe", userId, email, expiresAt: Date.now() + 366 * 86_400_000 })));
  return `${payload}.${await signature(payload, secret)}`;
}

export async function verifyUnsubscribeToken(token: string | null, secret: string | undefined): Promise<{ userId: string; email: string } | null> {
  if (!token || !secret || secret.length < 32) return null;
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra || !safeEqual(await signature(payload, secret), suppliedSignature)) return null;
  const bytes = base64UrlToBytes(payload);
  if (!bytes) return null;
  try {
    const value = JSON.parse(new TextDecoder().decode(bytes)) as { purpose?: string; userId?: string; email?: string; expiresAt?: number };
    return value.purpose === "unsubscribe" && value.userId && value.email && value.expiresAt && value.expiresAt > Date.now()
      ? { userId: value.userId, email: value.email }
      : null;
  } catch {
    return null;
  }
}

export async function verifyPasswordRecord(password: string, record: string | undefined): Promise<boolean> {
  if (!record || password.length > 200) return false;
  const [algorithm, iterationText, saltText, hashText, extra] = record.split("$");
  const iterations = Number(iterationText);
  const salt = base64UrlToBytes(saltText ?? "");
  const expected = base64UrlToBytes(hashText ?? "");
  if (algorithm !== "pbkdf2_sha256" || extra || !Number.isInteger(iterations) || iterations < 200_000 || !salt || !expected) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt.buffer as ArrayBuffer, iterations }, key, expected.byteLength * 8));
  if (actual.byteLength !== expected.byteLength) return false;
  let mismatch = 0;
  for (let index = 0; index < actual.byteLength; index += 1) mismatch |= actual[index] ^ expected[index];
  return mismatch === 0;
}
