import { env } from "cloudflare:workers";
import { db } from "../../../../lib/data";
import { adminFromRequest } from "../../../../lib/security";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const row = await db().prepare("SELECT object_key, approved FROM media WHERE id = ?").bind(id).first<{object_key:string;approved:number}>();
    if (!row || (!row.approved && !await adminFromRequest(request)) || !env.BUCKET) return new Response(null, { status: 404 });
    const object = await env.BUCKET.get(row.object_key); if (!object) return new Response(null, { status: 404 });
    return new Response(object.body, { headers: { "Content-Type": object.httpMetadata?.contentType || "application/octet-stream", "Cache-Control": row.approved ? "public, max-age=3600" : "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response(null, { status: 404 }); }
}
