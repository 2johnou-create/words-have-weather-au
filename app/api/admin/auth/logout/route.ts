import { clearSessionCookie } from "@/lib/session";

export async function POST() {
  return Response.json({ ok: true }, { headers: { "set-cookie": clearSessionCookie(), "cache-control": "no-store" } });
}
