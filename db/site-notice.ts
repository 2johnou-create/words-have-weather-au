import { env } from "cloudflare:workers";

export type SiteNotice = {
  id: string;
  enabled: boolean;
  message: string;
  linkLabel: string;
  linkHref: string;
  tone: "sage" | "sun" | "terracotta";
  startsAt: string;
  endsAt: string;
  updatedAt: string;
};

type SiteNoticeRow = {
  id: string;
  enabled: number;
  message: string;
  link_label: string | null;
  link_href: string | null;
  tone: "sage" | "sun" | "terracotta";
  starts_at: string | null;
  ends_at: string | null;
  updated_at: string;
};

function normalise(row: SiteNoticeRow): SiteNotice {
  return {
    id: row.id,
    enabled: Boolean(row.enabled),
    message: row.message,
    linkLabel: row.link_label ?? "",
    linkHref: row.link_href ?? "",
    tone: row.tone,
    startsAt: row.starts_at ?? "",
    endsAt: row.ends_at ?? "",
    updatedAt: row.updated_at,
  };
}

export async function getSiteNotice(includeInactive = false): Promise<SiteNotice | null> {
  try {
    if (!env.DB) return null;
    const row = await env.DB.prepare(
      "SELECT id, enabled, message, link_label, link_href, tone, starts_at, ends_at, updated_at FROM site_notices WHERE id = 'main' LIMIT 1",
    ).first<SiteNoticeRow>();
    if (!row) return null;
    const notice = normalise(row);
    if (includeInactive) return notice;
    const now = new Date().toISOString();
    if (!notice.enabled || (notice.startsAt && notice.startsAt > now) || (notice.endsAt && notice.endsAt <= now)) return null;
    return notice;
  } catch {
    return null;
  }
}
