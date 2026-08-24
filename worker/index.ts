/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import catalog from "../data/episode-catalog.json";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  RESOURCES: R2Bucket;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

const ADMIN_EMAILS = new Set(["2johnou@gmail.com"]);

async function syncWorkbookResources(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/admin/resource-sync") return null;
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const userId = request.headers.get("oai-authenticated-user-id");
  const email = request.headers.get("oai-authenticated-user-email")?.toLowerCase() ?? "";
  if (!userId || !ADMIN_EMAILS.has(email)) return new Response("Forbidden", { status: 403 });

  let payload: { start?: number; count?: number };
  try {
    payload = await request.json() as { start?: number; count?: number };
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
  const start = Number(payload.start);
  const count = Number(payload.count ?? 5);
  if (!Number.isInteger(start) || start < 1 || start > 120 || !Number.isInteger(count) || count < 1 || count > 10) {
    return new Response("Invalid episode range", { status: 400 });
  }

  let copied = 0;
  let existing = 0;
  const end = Math.min(120, start + count - 1);
  for (let episodeId = start; episodeId <= end; episodeId += 1) {
    const code = String(episodeId).padStart(3, "0");
    for (const suffix of ["educator-worksheet", "parent-practice-workbook"] as const) {
      const filename = `episode-${code}-${suffix}.pdf`;
      const key = `downloads/${filename}`;
      if (await env.RESOURCES.head(key)) {
        existing += 1;
        continue;
      }
      const assetUrl = new URL(`/downloads/${filename}`, request.url);
      const asset = await env.ASSETS.fetch(new Request(assetUrl));
      if (!asset.ok || !asset.body) return new Response(`Missing staged file: ${filename}`, { status: 500 });
      await env.RESOURCES.put(key, asset.body, { httpMetadata: { contentType: "application/pdf" } });
      copied += 1;
    }
  }

  return Response.json({ start, end, copied, existing });
}

async function gatedDownload(request: Request, env: Env, ctx: ExecutionContext): Promise<Response | null> {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/downloads\/episode-(\d{2,3})-(educator-worksheet|parent-practice-workbook)\.pdf$/);
  if (!match) return null;

  if (match[1].length === 2) {
    const canonical = new URL(
      `/downloads/episode-${match[1].padStart(3, "0")}-${match[2]}.pdf`,
      request.url,
    );
    canonical.search = url.search;
    return Response.redirect(canonical, 308);
  }

  const userId = request.headers.get("oai-authenticated-user-id");
  const email = request.headers.get("oai-authenticated-user-email")?.toLowerCase() ?? "";
  if (!userId) {
    const signIn = new URL("/signin-with-chatgpt", request.url);
    signIn.searchParams.set("return_to", url.pathname);
    return Response.redirect(signIn, 302);
  }

  const isOwner = ADMIN_EMAILS.has(email);
  if (!isOwner) {
    const member = await env.DB.prepare(
      "SELECT user_id FROM members WHERE user_id = ? LIMIT 1",
    ).bind(userId).first();
    if (!member) {
      const join = new URL("/join", request.url);
      join.searchParams.set("return_to", url.pathname);
      return Response.redirect(join, 302);
    }
  }

  const episodeId = Number(match[1]);
  const planned = (catalog as Array<{ id: number; releaseDate: string; defaultStatus: string }>).find((episode) => episode.id === episodeId);
  if (!planned) return new Response("Resource not found", { status: 404 });
  const override = await env.DB.prepare(
    "SELECT status, release_date FROM episode_overrides WHERE episode_id = ? LIMIT 1",
  ).bind(episodeId).first<{ status: string; release_date: string | null }>();
  const status = override?.status ?? planned.defaultStatus;
  const releaseDate = override?.release_date ?? planned.releaseDate;
  const today = new Date().toISOString().slice(0, 10);
  if (!isOwner && (status !== "enabled" || releaseDate > today)) {
    return new Response("This resource is not available yet.", { status: 404 });
  }

  const audience = match[2].startsWith("educator") ? "educator" : "parent";
  ctx.waitUntil(
    env.DB.prepare(
      "INSERT INTO download_events (user_id, episode_id, audience) VALUES (?, ?, ?)",
    ).bind(userId, episodeId, audience).run(),
  );
  const filename = url.pathname.split("/").pop()!;
  const staticAsset = await env.ASSETS.fetch(new Request(url));
  if (staticAsset.ok) {
    const headers = new Headers(staticAsset.headers);
    headers.set("content-type", "application/pdf");
    headers.set("cache-control", "private, no-store");
    headers.set("content-disposition", `attachment; filename="${filename}"`);
    return new Response(staticAsset.body, { status: 200, headers });
  }

  // Keep R2 as a backwards-compatible fallback for resources published before
  // the complete protected library became part of the versioned site assets.
  const asset = await env.RESOURCES.get(`downloads/${filename}`);
  if (!asset) return new Response("Resource not found", { status: 404 });
  const headers = new Headers();
  headers.set("content-type", asset.httpMetadata?.contentType ?? "application/pdf");
  headers.set("content-length", String(asset.size));
  headers.set("etag", asset.httpEtag);
  headers.set("cache-control", "private, no-store");
  headers.set("content-disposition", `attachment; filename="${filename}"`);
  return new Response(asset.body, { status: 200, headers });
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const sync = await syncWorkbookResources(request, env);
    if (sync) return sync;

    const download = await gatedDownload(request, env, ctx);
    if (download) return download;

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
