import { env } from "cloudflare:workers";
import { sessionCookie, signSiteSession, verifyPasswordRecord } from "@/lib/session";

type AdminEnvironment = { AUTH_SECRET?: string; ADMIN_EMAIL?: string; ADMIN_PASSWORD_RECORD?: string };

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const runtime = env as unknown as AdminEnvironment;
  const payload = await request.json() as Record<string, unknown>;
  const email = clean(payload.email, 254).toLowerCase();
  const password = clean(payload.password, 200);
  const configuredEmail = (runtime.ADMIN_EMAIL ?? "2johnou@gmail.com").toLowerCase();
  const valid = email === configuredEmail && await verifyPasswordRecord(password, runtime.ADMIN_PASSWORD_RECORD);
  if (!valid || !runtime.AUTH_SECRET) {
    return Response.json({ error: "The email or password is not correct." }, { status: 401, headers: { "cache-control": "no-store" } });
  }
  const token = await signSiteSession({
    kind: "admin",
    userId: "admin:owner",
    email: configuredEmail,
    fullName: "Words Have Weather administrator",
    expiresAt: Date.now() + 12 * 60 * 60 * 1000,
  }, runtime.AUTH_SECRET);
  return Response.json({ ok: true }, { headers: { "set-cookie": sessionCookie(token, 12 * 60 * 60), "cache-control": "no-store" } });
}
