import { env } from "cloudflare:workers";
import { deliverEmail, welcomeEmail } from "@/lib/email";
import { sessionCookie, sessionTokenFromRequest, signSiteSession, verifySiteSession } from "@/lib/session";

type MembershipEnv = {
  DB: D1Database;
  AUTH_SECRET?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  SITE_URL?: string;
};

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const payload = await request.json() as Record<string, unknown>;
  const firstName = cleanText(payload.firstName, 80);
  const lastName = cleanText(payload.lastName, 80);
  const email = cleanText(payload.email, 254).toLowerCase();
  const educationTerms = payload.educationTerms === true;
  const updatesOptIn = payload.updatesOptIn === true;

  if (!firstName || !lastName) return Response.json({ error: "First name and last name are required." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!educationTerms) return Response.json({ error: "Please accept the education-use terms." }, { status: 400 });
  const runtime = env as unknown as MembershipEnv;
  if (!runtime.DB || !runtime.AUTH_SECRET) return Response.json({ error: "Membership storage is temporarily unavailable." }, { status: 503 });

  const now = new Date().toISOString();
  const session = await verifySiteSession(sessionTokenFromRequest(request), runtime.AUTH_SECRET);
  const existing = await runtime.DB.prepare(
    "SELECT user_id FROM members WHERE user_id = ? OR lower(email) = ? LIMIT 1",
  ).bind(session?.kind === "member" ? session.userId : "", email).first<{ user_id: string }>();
  const userId = existing?.user_id ?? `member:${crypto.randomUUID()}`;

  await runtime.DB.prepare(
    `INSERT INTO members (user_id, first_name, last_name, email, education_terms_accepted_at, updates_opt_in, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       first_name = excluded.first_name,
       last_name = excluded.last_name,
       email = excluded.email,
       education_terms_accepted_at = excluded.education_terms_accepted_at,
       updates_opt_in = excluded.updates_opt_in,
       updated_at = excluded.updated_at`,
  ).bind(userId, firstName, lastName, email, now, updatesOptIn ? 1 : 0, now, now).run();

  if (!existing) {
    const message = welcomeEmail(firstName, email, runtime.SITE_URL ?? new URL(request.url).origin);
    const delivery = await deliverEmail(runtime, message);
    await runtime.DB.prepare(
      `INSERT OR IGNORE INTO email_outbox
       (id, user_id, recipient, kind, campaign_key, subject, html, status, scheduled_for, sent_at, last_error, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      crypto.randomUUID(), userId, email, message.kind, "welcome:v1", message.subject, message.html,
      delivery.sent ? "sent" : "queued", now, delivery.sent ? now : null, delivery.error, now,
    ).run();
  }

  const token = await signSiteSession({
    kind: "member",
    userId,
    email,
    fullName: `${firstName} ${lastName}`,
    expiresAt: Date.now() + 365 * 86_400_000,
  }, runtime.AUTH_SECRET);

  return Response.json(
    { ok: true, membership: "active" },
    { headers: { "set-cookie": sessionCookie(token) } },
  );
}
