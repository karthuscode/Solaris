import { env } from "cloudflare:workers";
import { db } from "../../../../../lib/data";
import { adminFromRequest } from "../../../../../lib/security";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const row = await db().prepare("SELECT logo_key, approved FROM partners WHERE id = ?").bind((await params).id).first<{logo_key:string|null;approved:number}>(); if (!row?.logo_key || (!row.approved && !await adminFromRequest(request)) || !env.BUCKET) return new Response(null, { status: 404 }); const object = await env.BUCKET.get(row.logo_key); if (!object) return new Response(null, { status: 404 }); return new Response(object.body, { headers: { "Content-Type": object.httpMetadata?.contentType || "application/octet-stream", "Cache-Control": row.approved ? "public, max-age=3600" : "private, no-store", "X-Content-Type-Options": "nosniff" } }); } catch { return new Response(null, { status: 404 }); }
}
