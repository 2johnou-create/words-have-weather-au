import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isAdmin } from "@/app/admin-access";
import { episodes, type EpisodeStatus } from "@/data/episodes";

async function requireAdmin() {
  const user = await getChatGPTUser();
  return isAdmin(user) ? user : null;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 403 });
  if (!env.DB) return Response.json({ error: "Release storage is unavailable." }, { status: 503 });
  const result = await env.DB.prepare(
    "SELECT episode_id, status, release_date, updated_at FROM episode_overrides ORDER BY episode_id",
  ).all();
  return Response.json({ overrides: result.results });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return Response.json({ error: "Admin access required." }, { status: 403 });
  if (!env.DB) return Response.json({ error: "Release storage is unavailable." }, { status: 503 });
  const payload = await request.json() as {
    ids?: number[];
    action?: "update" | "reset";
    status?: EpisodeStatus;
    releaseDate?: string;
  };
  const validIds = new Set(episodes.map((episode) => episode.id));
  const ids = Array.from(new Set((payload.ids ?? []).filter((id) => Number.isInteger(id) && validIds.has(id))));
  if (ids.length === 0) return Response.json({ error: "Select at least one valid episode." }, { status: 400 });

  if (payload.action === "reset") {
    await env.DB.batch(ids.map((id) => env.DB.prepare("DELETE FROM episode_overrides WHERE episode_id = ?").bind(id)));
    return Response.json({ ok: true });
  }

  const status = payload.status;
  if (status && !["enabled", "disabled", "removed"].includes(status)) {
    return Response.json({ error: "Invalid release status." }, { status: 400 });
  }
  const releaseDate = payload.releaseDate;
  if (releaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
    return Response.json({ error: "Use a valid release date." }, { status: 400 });
  }
  const byId = new Map(episodes.map((episode) => [episode.id, episode]));
  const now = new Date().toISOString();
  await env.DB.batch(ids.map((id) => {
    const planned = byId.get(id)!;
    return env.DB.prepare(
      `INSERT INTO episode_overrides (episode_id, status, release_date, updated_by, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(episode_id) DO UPDATE SET
         status = excluded.status,
         release_date = excluded.release_date,
         updated_by = excluded.updated_by,
         updated_at = excluded.updated_at`,
    ).bind(
      id,
      status ?? planned.defaultStatus,
      releaseDate ?? planned.releaseDate,
      user.email,
      now,
    );
  }));
  return Response.json({ ok: true });
}
