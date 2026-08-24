import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isAdmin } from "@/app/admin-access";

type EmailAdminEnvironment = { DB: D1Database; RESEND_API_KEY?: string; EMAIL_FROM?: string };

export async function GET() {
  if (!isAdmin(await getChatGPTUser())) return Response.json({ error: "Admin access required." }, { status: 403 });
  const runtime = env as unknown as EmailAdminEnvironment;
  const [members, outbox] = await Promise.all([
    runtime.DB.prepare("SELECT count(*) AS total, sum(CASE WHEN updates_opt_in = 1 THEN 1 ELSE 0 END) AS subscribers FROM members").first<{ total: number; subscribers: number | null }>(),
    runtime.DB.prepare("SELECT status, count(*) AS total FROM email_outbox GROUP BY status").all<{ status: string; total: number }>(),
  ]);
  return Response.json({
    providerConfigured: Boolean(runtime.RESEND_API_KEY && runtime.EMAIL_FROM),
    from: runtime.EMAIL_FROM ?? null,
    members: members?.total ?? 0,
    subscribers: members?.subscribers ?? 0,
    outbox: Object.fromEntries(outbox.results.map((row) => [row.status, row.total])),
    cadence: { weekly: "Monday morning (Australia/Sydney)", monthly: "Last day of each month" },
  });
}
