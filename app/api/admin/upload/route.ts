import { env } from "cloudflare:workers";
import { db } from "../../../../lib/data";
import { requireAdmin, rejectCrossOrigin } from "../../../../lib/security";

const types = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const extensions: Record<string,string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

export async function POST(request: Request) {
  const origin = rejectCrossOrigin(request); if (origin) return origin;
  const forbidden = await requireAdmin(request); if (forbidden) return forbidden;
  try {
    if (!env.BUCKET) throw new Error("BUCKET_NOT_CONFIGURED");
    const form = await request.formData(); const file = form.get("file"); const kind = String(form.get("kind") || "gallery");
    if (!(file instanceof File) || !types.has(file.type) || file.size > 8 * 1024 * 1024 || file.size < 100) return Response.json({ message: "JPG, PNG, WebP vagy AVIF képet tölts fel, legfeljebb 8 MB méretben." }, { status: 400 });
    if (kind === "logo") {
      const partnerId = String(form.get("partnerId") || "");
      const partner = await db().prepare("SELECT id FROM partners WHERE id = ?").bind(partnerId).first();
      if (!partner) return Response.json({ message: "A partner nem található." }, { status: 404 });
      const key = `partners/${partnerId}/${crypto.randomUUID()}.${extensions[file.type]}`;
      await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
      await db().prepare("UPDATE partners SET logo_key = ? WHERE id = ?").bind(key, partnerId).run();
      return Response.json({ message: "Partnerlogó feltöltve." });
    }
    const eventSlug = String(form.get("eventSlug") || "");
    const event = await db().prepare("SELECT slug FROM events WHERE slug = ?").bind(eventSlug).first();
    if (!event) return Response.json({ message: "Az eseményt előbb mentsd el." }, { status: 400 });
    const count = await db().prepare("SELECT COUNT(*) AS count FROM media WHERE event_slug = ?").bind(eventSlug).first<{count:number}>();
    if ((count?.count || 0) >= 30) return Response.json({ message: "Egy eseményhez legfeljebb 30 kép tölthető fel." }, { status: 400 });
    const id = crypto.randomUUID(); const key = `events/${eventSlug}/${id}.${extensions[file.type]}`;
    await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    await db().prepare("INSERT INTO media (id, event_slug, object_key, caption, credit, sort_order, approved) VALUES (?, ?, ?, ?, ?, ?, 0)").bind(id, eventSlug, key, String(form.get("caption") || "").slice(0,250), String(form.get("credit") || "").slice(0,120), count?.count || 0).run();
    return Response.json({ message: "Fotó feltöltve. Jóváhagyás után megjelenik az oldalon.", id });
  } catch { return Response.json({ message: "A feltöltés nem sikerült." }, { status: 503 }); }
}

export async function DELETE(request: Request) {
  const origin = rejectCrossOrigin(request); if (origin) return origin;
  const forbidden = await requireAdmin(request); if (forbidden) return forbidden;
  try { const body = await request.json() as { id?: string }; const row = await db().prepare("SELECT object_key FROM media WHERE id = ?").bind(body.id || "").first<{object_key:string}>(); if (!row) return Response.json({ message: "A kép nem található." }, { status: 404 }); if (env.BUCKET) await env.BUCKET.delete(row.object_key); await db().prepare("DELETE FROM media WHERE id = ?").bind(body.id).run(); return Response.json({ message: "Fotó törölve." }); } catch { return Response.json({ message: "A törlés nem sikerült." }, { status: 503 }); }
}
