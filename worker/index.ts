/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import catalog from "../data/episode-catalog.json";
import { ebooks } from "../data/ebooks";
import { sessionTokenFromRequest, verifySiteSession } from "../lib/session";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  RESOURCES: R2Bucket;
  AUTH_SECRET?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

type RuntimeEnv = Env | undefined;

async function gatedEbookDownload(request: Request, env: RuntimeEnv): Promise<Response | null> {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/ebook-downloads\/([a-z0-9-]+?)(-education-edition)?\.(pdf|epub)$/);
  if (!match) return null;
  if (!env) return new Response("Resource storage is unavailable.", { status: 503 });
  const slug = match[1];
  const fileType = match[3];
  const book = ebooks.find((item) => item.slug === slug);
  if (!book || (fileType === "pdf" && !match[2]) || (fileType === "epub" && match[2])) return new Response("Resource not found", { status: 404 });

  const session = await verifySiteSession(sessionTokenFromRequest(request), env.AUTH_SECRET);
  if (!session) {
    const join = new URL("/join", request.url);
    join.searchParams.set("return_to", url.pathname);
    return Response.redirect(join, 302);
  }
  if (session.kind !== "admin") {
    const member = await env.DB.prepare("SELECT user_id FROM members WHERE user_id = ? LIMIT 1").bind(session.userId).first();
    if (!member) {
      const join = new URL("/join", request.url);
      join.searchParams.set("return_to", url.pathname);
      return Response.redirect(join, 302);
    }
  }

  const filename = url.pathname.split("/").pop()!;
  const asset = await env.RESOURCES.get(`ebook-downloads/${filename}`);
  if (!asset) return new Response("Resource not found", { status: 404 });
  const headers = new Headers();
  headers.set("content-type", asset.httpMetadata?.contentType ?? (fileType === "epub" ? "application/epub+zip" : "application/pdf"));
  headers.set("content-length", String(asset.size));
  headers.set("etag", asset.httpEtag);
  headers.set("cache-control", "private, no-store");
  headers.set("content-disposition", `attachment; filename="${filename}"`);
  return new Response(asset.body, { status: 200, headers });
}

async function gatedDownload(request: Request, env: RuntimeEnv, ctx: ExecutionContext): Promise<Response | null> {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/downloads\/episode-(\d{2,3})-(educator-worksheet|parent-practice-workbook)\.pdf$/);
  if (!match) return null;
  if (!env) return new Response("Resource storage is unavailable.", { status: 503 });

  if (match[1].length === 2) {
    const canonical = new URL(
      `/downloads/episode-${match[1].padStart(3, "0")}-${match[2]}.pdf`,
      request.url,
    );
    canonical.search = url.search;
    return Response.redirect(canonical, 308);
  }

  const session = await verifySiteSession(sessionTokenFromRequest(request), env.AUTH_SECRET);
  if (!session) {
    const join = new URL("/join", request.url);
    join.searchParams.set("return_to", url.pathname);
    return Response.redirect(join, 302);
  }

  const userId = session.userId;
  const isOwner = session.kind === "admin";
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
  async fetch(request: Request, env: RuntimeEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const ebookDownload = await gatedEbookDownload(request, env);
    if (ebookDownload) return ebookDownload;

    const download = await gatedDownload(request, env, ctx);
    if (download) return download;

    if (url.pathname === "/_vinext/image") {
      if (!env) return new Response("Image service is unavailable.", { status: 503 });
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    const session = await verifySiteSession(sessionTokenFromRequest(request), env?.AUTH_SECRET);
    const headers = new Headers(request.headers);
    headers.delete("oai-authenticated-user-id");
    headers.delete("oai-authenticated-user-email");
    headers.delete("oai-authenticated-user-full-name");
    headers.delete("oai-authenticated-user-full-name-encoding");
    if (session) {
      headers.set("oai-authenticated-user-id", session.userId);
      headers.set("oai-authenticated-user-email", session.email);
      headers.set("oai-authenticated-user-full-name", encodeURIComponent(session.fullName));
      headers.set("oai-authenticated-user-full-name-encoding", "percent-encoded-utf-8");
    }
    return handler.fetch(new Request(request, { headers }), env as Env, ctx);
  },
};

export default worker;
