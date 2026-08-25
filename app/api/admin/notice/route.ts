import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isAdmin } from "@/app/admin-access";
import { getSiteNotice, type SiteNotice } from "@/db/site-notice";

async function requireAdmin() {
  const user = await getChatGPTUser();
  return isAdmin(user) ? user : null;
}

function validLink(value: string) {
  return !value || /^\/(?!\/)[^\s]*$/.test(value) || /^https:\/\/[^\s]+$/.test(value);
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 403 });
  return Response.json({ notice: await getSiteNotice(true) });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 403 });
  if (!env.DB) return Response.json({ error: "Notification storage is unavailable." }, { status: 503 });
  const payload = await request.json() as Partial<SiteNotice>;
  const message = payload.message?.trim() ?? "";
  const linkLabel = payload.linkLabel?.trim() ?? "";
  const linkHref = payload.linkHref?.trim() ?? "";
  const tone = payload.tone ?? "sage";
  const startsAt = payload.startsAt?.trim() || null;
  const endsAt = payload.endsAt?.trim() || null;
  if (message.length < 3 || message.length > 180) return Response.json({ error: "Use a message between 3 and 180 characters." }, { status: 400 });
  if (linkLabel.length > 48 || !validLink(linkHref)) return Response.json({ error: "Use a short label and a safe relative or HTTPS link." }, { status: 400 });
  if ((linkLabel && !linkHref) || (linkHref && !linkLabel)) return Response.json({ error: "Add both a link label and link, or leave both empty." }, { status: 400 });
  if (!["sage", "sun", "terracotta"].includes(tone)) return Response.json({ error: "Choose a valid notification tone." }, { status: 400 });
  if (startsAt && Number.isNaN(Date.parse(startsAt))) return Response.json({ error: "Use a valid start time." }, { status: 400 });
  if (endsAt && Number.isNaN(Date.parse(endsAt))) return Response.json({ error: "Use a valid end time." }, { status: 400 });
  if (startsAt && endsAt && startsAt >= endsAt) return Response.json({ error: "The end time must be after the start time." }, { status: 400 });
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO site_notices (id, enabled, message, link_label, link_href, tone, starts_at, ends_at, updated_by, updated_at)
     VALUES ('main', ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET enabled = excluded.enabled, message = excluded.message, link_label = excluded.link_label, link_href = excluded.link_href, tone = excluded.tone, starts_at = excluded.starts_at, ends_at = excluded.ends_at, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
  ).bind(payload.enabled === false ? 0 : 1, message, linkLabel || null, linkHref || null, tone, startsAt, endsAt, user.email, now).run();
  return Response.json({ notice: await getSiteNotice(true) });
}
