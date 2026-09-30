import { db, getEvents, getPartners, purgeExpiredRsvps } from "../../../../lib/data";
import { requireAdmin } from "../../../../lib/security";

export async function GET(request: Request) {
  const forbidden = await requireAdmin(request); if (forbidden) return forbidden;
  try {
    await purgeExpiredRsvps();
    const [events, partners, media, videos, testimonials, copy, rsvps, inquiries] = await Promise.all([
      getEvents(true), getPartners(true),
      db().prepare("SELECT * FROM media ORDER BY event_slug, sort_order").all(),
      db().prepare("SELECT * FROM video_links ORDER BY event_slug, id").all(),
      db().prepare("SELECT * FROM testimonials ORDER BY id").all(),
      db().prepare("SELECT * FROM site_copy ORDER BY key").all(),
      db().prepare("SELECT * FROM rsvps ORDER BY created_at DESC").all(),
      db().prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all(),
    ]);
    return Response.json({ events, partners, media: media.results, videos: videos.results, testimonials: testimonials.results, copy: copy.results, rsvps: rsvps.results, inquiries: inquiries.results });
  } catch { return Response.json({ message: "Az adatok most nem érhetők el." }, { status: 503 }); }
}
