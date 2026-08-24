import { env } from "cloudflare:workers";
import type { EpisodeOverride, EpisodeStatus } from "@/data/episodes";

type OverrideRow = {
  episode_id: number;
  status: EpisodeStatus;
  release_date: string | null;
  updated_at: string;
};

export async function loadEpisodeOverrides(): Promise<Record<number, EpisodeOverride>> {
  try {
    if (!env.DB) return {};
    const result = await env.DB.prepare(
      "SELECT episode_id, status, release_date, updated_at FROM episode_overrides",
    ).all<OverrideRow>();
    return Object.fromEntries(
      result.results.map((row) => [
        row.episode_id,
        {
          episodeId: row.episode_id,
          status: row.status,
          releaseDate: row.release_date,
          updatedAt: row.updated_at,
        },
      ]),
    );
  } catch {
    return {};
  }
}

export async function getMember(userId: string) {
  if (!env.DB) return null;
  return env.DB.prepare(
    "SELECT user_id, first_name, last_name, email, education_terms_accepted_at, updates_opt_in FROM members WHERE user_id = ? LIMIT 1",
  )
    .bind(userId)
    .first<{
      user_id: string;
      first_name: string;
      last_name: string;
      email: string;
      education_terms_accepted_at: string;
      updates_opt_in: number;
    }>();
}
