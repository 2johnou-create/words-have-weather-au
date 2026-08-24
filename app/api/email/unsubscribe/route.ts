import { env } from "cloudflare:workers";
import { verifyUnsubscribeToken } from "@/lib/session";

type UnsubscribeEnvironment = { DB: D1Database; AUTH_SECRET?: string };

export async function POST(request: Request) {
  const runtime = env as unknown as UnsubscribeEnvironment;
  const payload = await request.json() as { token?: string };
  const preference = await verifyUnsubscribeToken(payload.token ?? null, runtime.AUTH_SECRET);
  if (!preference || !runtime.DB) return Response.json({ error: "This unsubscribe link is not valid." }, { status: 400 });
  await runtime.DB.prepare("UPDATE members SET updates_opt_in = 0, updated_at = ? WHERE user_id = ? AND lower(email) = ?")
    .bind(new Date().toISOString(), preference.userId, preference.email.toLowerCase()).run();
  return Response.json({ ok: true });
}
