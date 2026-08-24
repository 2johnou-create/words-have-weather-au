import { env } from "cloudflare:workers";
import { episodes } from "@/data/episodes";
import { deliverEmail, monthlyReleaseEmail, weeklyHighlightEmail, type EmailMessage } from "@/lib/email";
import { signUnsubscribeToken } from "@/lib/session";

type DispatchEnvironment = {
  DB: D1Database;
  AUTH_SECRET?: string;
  EMAIL_CRON_SECRET?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  SITE_URL?: string;
};

type MemberRow = { user_id: string; first_name: string; email: string };
type OutboxRow = { id: string; recipient: string; subject: string; html: string; kind: EmailMessage["kind"] };

function sydneyDate() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
  }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, year: Number(parts.year), month: Number(parts.month), day: Number(parts.day), weekday: parts.weekday };
}

async function queue(runtime: DispatchEnvironment, member: MemberRow, campaignKey: string, message: EmailMessage, now: string) {
  await runtime.DB.prepare(
    `INSERT OR IGNORE INTO email_outbox
     (id, user_id, recipient, kind, campaign_key, subject, html, status, scheduled_for, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'queued', ?, ?)`,
  ).bind(crypto.randomUUID(), member.user_id, member.email, message.kind, campaignKey, message.subject, message.html, now, now).run();
}

export async function POST(request: Request) {
  const runtime = env as unknown as DispatchEnvironment;
  const supplied = request.headers.get("authorization");
  if (!runtime.EMAIL_CRON_SECRET || supplied !== `Bearer ${runtime.EMAIL_CRON_SECRET}`) return Response.json({ error: "Not authorised." }, { status: 401 });
  if (!runtime.DB || !runtime.AUTH_SECRET) return Response.json({ error: "Engagement storage is unavailable." }, { status: 503 });

  const calendar = sydneyDate();
  const now = new Date().toISOString();
  const members = (await runtime.DB.prepare(
    "SELECT user_id, first_name, email FROM members WHERE updates_opt_in = 1 ORDER BY created_at",
  ).all<MemberRow>()).results;
  let queued = 0;

  if (calendar.weekday === "Mon") {
    const firstDay = new Date(Date.UTC(calendar.year, calendar.month - 1, 1)).getUTCDay();
    const week = Math.ceil((calendar.day + firstDay) / 7);
    const available = episodes.filter((episode) => episode.defaultStatus === "enabled" && episode.releaseDate <= calendar.date);
    const episode = available[(calendar.year * 53 + calendar.month * 5 + week) % Math.max(available.length, 1)];
    if (episode) {
      const key = `weekly:${calendar.year}-${String(calendar.month).padStart(2, "0")}-${week}`;
      for (const member of members) {
        const unsubscribeToken = await signUnsubscribeToken(member.user_id, member.email, runtime.AUTH_SECRET);
        await queue(runtime, member, key, weeklyHighlightEmail({ firstName: member.first_name, email: member.email, title: episode.title, keyLearning: episode.keyLearning, code: episode.code, unsubscribeToken, siteUrl: runtime.SITE_URL }), now);
        queued += 1;
      }
    }
  }

  const lastDay = new Date(Date.UTC(calendar.year, calendar.month, 0)).getUTCDate();
  if (calendar.day === lastDay) {
    const nextDate = new Date(Date.UTC(calendar.year, calendar.month, 1));
    const releasePrefix = `${nextDate.getUTCFullYear()}-${String(nextDate.getUTCMonth() + 1).padStart(2, "0")}`;
    const releaseMonth = new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric", timeZone: "UTC" }).format(nextDate);
    const releases = episodes.filter((episode) => episode.releaseDate.startsWith(releasePrefix));
    const key = `monthly:${releasePrefix}`;
    for (const member of members) {
      const unsubscribeToken = await signUnsubscribeToken(member.user_id, member.email, runtime.AUTH_SECRET);
      await queue(runtime, member, key, monthlyReleaseEmail({ firstName: member.first_name, email: member.email, month: releaseMonth, releases, unsubscribeToken, siteUrl: runtime.SITE_URL }), now);
      queued += 1;
    }
  }

  const outbox = (await runtime.DB.prepare(
    "SELECT id, recipient, subject, html, kind FROM email_outbox WHERE status = 'queued' AND scheduled_for <= ? ORDER BY created_at LIMIT 100",
  ).bind(now).all<OutboxRow>()).results;
  let sent = 0;
  if (runtime.RESEND_API_KEY && runtime.EMAIL_FROM) {
    for (const row of outbox) {
      const result = await deliverEmail(runtime, { to: row.recipient, subject: row.subject, html: row.html, kind: row.kind });
      await runtime.DB.prepare(
        "UPDATE email_outbox SET status = ?, sent_at = ?, last_error = ? WHERE id = ?",
      ).bind(result.sent ? "sent" : "failed", result.sent ? new Date().toISOString() : null, result.error, row.id).run();
      if (result.sent) sent += 1;
    }
  }

  return Response.json({ ok: true, date: calendar.date, subscribers: members.length, queued, pending: outbox.length - sent, sent, providerConfigured: Boolean(runtime.RESEND_API_KEY && runtime.EMAIL_FROM) });
}
