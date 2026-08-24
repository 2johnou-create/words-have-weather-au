import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Please sign in before joining." }, { status: 401 });

  const payload = await request.json() as Record<string, unknown>;
  const firstName = cleanText(payload.firstName, 80);
  const lastName = cleanText(payload.lastName, 80);
  const email = cleanText(payload.email, 254).toLowerCase();
  const educationTerms = payload.educationTerms === true;
  const updatesOptIn = payload.updatesOptIn === true;

  if (!firstName || !lastName) return Response.json({ error: "First name and last name are required." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!educationTerms) return Response.json({ error: "Please accept the education-use terms." }, { status: 400 });
  if (!env.DB) return Response.json({ error: "Membership storage is temporarily unavailable." }, { status: 503 });

  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO members (user_id, first_name, last_name, email, education_terms_accepted_at, updates_opt_in, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       first_name = excluded.first_name,
       last_name = excluded.last_name,
       email = excluded.email,
       education_terms_accepted_at = excluded.education_terms_accepted_at,
       updates_opt_in = excluded.updates_opt_in,
       updated_at = excluded.updated_at`,
  ).bind(user.userId, firstName, lastName, email, now, updatesOptIn ? 1 : 0, now, now).run();

  return Response.json({ ok: true });
}
