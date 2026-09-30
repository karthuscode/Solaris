import { env } from "cloudflare:workers";
import { defaultCopy, firstEvent, type SolarisEvent } from "./content";

export type MediaItem = { id: string; event_slug: string; object_key: string; caption: string; credit: string; sort_order: number; approved: number };
export type Partner = { id: string; name: string; event_slug: string | null; website: string | null; logo_key: string | null; approved: number; sort_order: number };
export type Inquiry = { id: string; name: string; email: string; kind: string; message: string; created_at: string; status: string };
export type Rsvp = { id: string; event_slug: string; email: string; created_at: string; email_status: string };
export type VideoLink = { id: string; event_slug: string; url: string; caption: string; approved: number };
export type Testimonial = { id: string; quote: string; author: string; event_slug: string | null; approved: number };

export function db(): D1Database { if (!env.DB) throw new Error("DB_NOT_CONFIGURED"); return env.DB; }

function rowToEvent(row: Record<string, unknown>): SolarisEvent {
  return { id: String(row.id), slug: String(row.slug), title: String(row.title), subtitle: String(row.subtitle), startsAt: row.starts_at ? String(row.starts_at) : null, city: String(row.city), venue: String(row.venue), summary: String(row.summary), cycling: String(row.cycling), monarch: String(row.monarch), status: row.status === "published" ? "published" : "draft", rsvpOpen: Number(row.rsvp_open) === 1, updatedAt: String(row.updated_at) };
}

export async function getEvents(includeDrafts = false): Promise<SolarisEvent[]> {
  try {
    await purgeExpiredRsvps();
    const result = await db().prepare(includeDrafts ? "SELECT * FROM events ORDER BY starts_at DESC" : "SELECT * FROM events WHERE status = 'published' ORDER BY starts_at DESC").all<Record<string, unknown>>();
    const events = result.results.map(rowToEvent);
    if ((includeDrafts || env.PUBLIC_LAUNCH_READY !== "1") && !events.some((e) => e.slug === firstEvent.slug)) events.push(firstEvent);
    return events.sort((a,b) => (b.startsAt ?? "").localeCompare(a.startsAt ?? ""));
  } catch { return env.PUBLIC_LAUNCH_READY === "1" && !includeDrafts ? [] : [firstEvent]; }
}

export async function getEvent(slug: string): Promise<SolarisEvent | null> {
  try { await purgeExpiredRsvps(); const row = await db().prepare("SELECT * FROM events WHERE slug = ?").bind(slug).first<Record<string, unknown>>(); if (row) { const event = rowToEvent(row); return event.status === "published" || env.PUBLIC_LAUNCH_READY !== "1" ? event : null; } } catch { /* Private preview can render before D1 is configured. */ }
  return slug === firstEvent.slug && env.PUBLIC_LAUNCH_READY !== "1" ? firstEvent : null;
}

export async function getCopy(key: string) {
  try { const row = await db().prepare("SELECT value FROM site_copy WHERE key = ? AND locale = 'hu'").bind(key).first<{value:string}>(); return row?.value ?? defaultCopy[key] ?? ""; } catch { return defaultCopy[key] ?? ""; }
}

export async function getMedia(eventSlug: string, includeDrafts = false): Promise<MediaItem[]> {
  try { const q = includeDrafts ? "SELECT * FROM media WHERE event_slug = ? ORDER BY sort_order, id" : "SELECT * FROM media WHERE event_slug = ? AND approved = 1 ORDER BY sort_order, id"; return (await db().prepare(q).bind(eventSlug).all<MediaItem>()).results; } catch { return []; }
}

export async function getPartners(includeDrafts = false): Promise<Partner[]> {
  try { const q = includeDrafts ? "SELECT * FROM partners ORDER BY sort_order, name" : "SELECT * FROM partners WHERE approved = 1 ORDER BY sort_order, name"; return (await db().prepare(q).all<Partner>()).results; } catch { return []; }
}

export async function getVideos(eventSlug: string, includeDrafts = false): Promise<VideoLink[]> {
  try { const q = includeDrafts ? "SELECT * FROM video_links WHERE event_slug = ? ORDER BY id" : "SELECT * FROM video_links WHERE event_slug = ? AND approved = 1 ORDER BY id"; return (await db().prepare(q).bind(eventSlug).all<VideoLink>()).results; } catch { return []; }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try { return (await db().prepare("SELECT * FROM testimonials WHERE approved = 1 ORDER BY id").all<Testimonial>()).results; } catch { return []; }
}

export async function purgeExpiredRsvps() {
  const cutoff = new Date(Date.now() - 30 * 86400000).toISOString();
  return db().prepare("DELETE FROM rsvps WHERE event_slug IN (SELECT slug FROM events WHERE starts_at IS NOT NULL AND starts_at < ?) OR (event_slug = ? AND ? < ?)")
    .bind(cutoff, firstEvent.slug, firstEvent.startsAt, cutoff).run();
}
