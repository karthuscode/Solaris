import { db } from "../../../../lib/data";
import { requireAdmin, rejectCrossOrigin } from "../../../../lib/security";

function str(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function website(raw: unknown) { if (!raw) return null; try { const u = new URL(String(raw)); return u.protocol === "https:" ? u.toString() : null; } catch { return null; } }
function fail(message: string, status = 400) { return Response.json({ message }, { status }); }

export async function POST(request: Request) {
  const origin = rejectCrossOrigin(request); if (origin) return origin;
  const forbidden = await requireAdmin(request); if (forbidden) return forbidden;
  try {
    const body = await request.json() as Record<string, unknown>;
    const action = str(body.action, 50); const now = new Date().toISOString(); const database = db();
    if (action === "saveEvent") {
      const slug = str(body.slug, 80).toLowerCase(); const title = str(body.title, 140);
      const startsAt = body.startsAt ? str(body.startsAt, 40) : null;
      const status = body.status === "published" ? "published" : "draft";
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title || (startsAt && Number.isNaN(new Date(startsAt).getTime()))) return fail("Ellenőrizd az esemény nevét, azonosítóját és időpontját.");
      const rsvpOpen = !!body.rsvpOpen && status === "published" && !!startsAt && new Date(startsAt).getTime() > Date.now();
      await database.prepare("INSERT INTO events (id, slug, title, subtitle, starts_at, city, venue, summary, cycling, monarch, status, rsvp_open, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(slug) DO UPDATE SET title = excluded.title, subtitle = excluded.subtitle, starts_at = excluded.starts_at, city = excluded.city, venue = excluded.venue, summary = excluded.summary, cycling = excluded.cycling, monarch = excluded.monarch, status = excluded.status, rsvp_open = excluded.rsvp_open, updated_at = excluded.updated_at")
        .bind(crypto.randomUUID(), slug, title, str(body.subtitle, 140), startsAt, str(body.city, 100), str(body.venue, 180), str(body.summary, 1200), str(body.cycling, 2000), str(body.monarch, 2000), status, rsvpOpen ? 1 : 0, now).run();
      return Response.json({ message: "Esemény mentve." });
    }
    if (action === "saveCopy") {
      const key = str(body.key, 40); if (!["home_intro", "home_next", "about_intro"].includes(key)) return fail("Ismeretlen szövegmező.");
      const value = str(body.value, 1200); if (!value) return fail("A szöveg nem lehet üres.");
      await database.prepare("INSERT INTO site_copy (key, locale, value, updated_at) VALUES (?, 'hu', ?, ?) ON CONFLICT(key, locale) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").bind(key, value, now).run();
      return Response.json({ message: "Szöveg mentve." });
    }
    if (action === "savePartner") {
      const id = str(body.id, 50) || crypto.randomUUID(); const name = str(body.name, 120); if (!name) return fail("Add meg a partner nevét.");
      await database.prepare("INSERT INTO partners (id, name, event_slug, website, logo_key, approved, sort_order) VALUES (?, ?, ?, ?, NULL, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, event_slug = excluded.event_slug, website = excluded.website, approved = excluded.approved, sort_order = excluded.sort_order").bind(id, name, str(body.eventSlug, 80) || null, website(body.website), body.approved ? 1 : 0, Number(body.sortOrder) || 0).run();
      return Response.json({ message: "Partner mentve.", id });
    }
    if (action === "saveVideo") {
      const id = str(body.id, 50) || crypto.randomUUID(); const url = website(body.url); const eventSlug = str(body.eventSlug, 80); if (!url || !eventSlug) return fail("Adj meg érvényes HTTPS-videólinket és eseményt.");
      await database.prepare("INSERT INTO video_links (id, event_slug, url, caption, approved) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET event_slug = excluded.event_slug, url = excluded.url, caption = excluded.caption, approved = excluded.approved").bind(id, eventSlug, url, str(body.caption, 200), body.approved ? 1 : 0).run();
      return Response.json({ message: "Videólink mentve." });
    }
    if (action === "saveTestimonial") {
      const id = str(body.id, 50) || crypto.randomUUID(); const quote = str(body.quote, 600); const author = str(body.author, 100); if (!quote || !author) return fail("Az idézet és a név kötelező.");
      if (body.approved && !body.consentConfirmed) return fail("A közzétételhez erősítsd meg az idézet szerzőjének jóváhagyását.");
      await database.prepare("INSERT INTO testimonials (id, quote, author, event_slug, approved) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET quote = excluded.quote, author = excluded.author, event_slug = excluded.event_slug, approved = excluded.approved").bind(id, quote, author, str(body.eventSlug, 80) || null, body.approved ? 1 : 0).run();
      return Response.json({ message: "Idézet mentve." });
    }
    if (action === "approveMedia") {
      const id = str(body.id, 50); await database.prepare("UPDATE media SET approved = ?, caption = ?, credit = ? WHERE id = ?").bind(body.approved ? 1 : 0, str(body.caption, 250), str(body.credit, 120), id).run(); return Response.json({ message: "Fotó mentve." });
    }
    if (action === "markInquiry") { await database.prepare("UPDATE inquiries SET status = ? WHERE id = ?").bind(body.status === "done" ? "done" : "new", str(body.id, 50)).run(); return Response.json({ message: "Megkeresés frissítve." }); }
    if (action === "deleteRsvp") { await database.prepare("DELETE FROM rsvps WHERE id = ?").bind(str(body.id, 50)).run(); return Response.json({ message: "E-mail-cím törölve." }); }
    if (action === "deletePartner") { await database.prepare("DELETE FROM partners WHERE id = ?").bind(str(body.id, 50)).run(); return Response.json({ message: "Partner törölve." }); }
    if (action === "deleteVideo") { await database.prepare("DELETE FROM video_links WHERE id = ?").bind(str(body.id, 50)).run(); return Response.json({ message: "Videólink törölve." }); }
    if (action === "deleteTestimonial") { await database.prepare("DELETE FROM testimonials WHERE id = ?").bind(str(body.id, 50)).run(); return Response.json({ message: "Idézet törölve." }); }
    return fail("Ismeretlen művelet.");
  } catch { return fail("A mentés nem sikerült. Próbáld újra.", 503); }
}
