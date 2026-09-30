import { env } from "cloudflare:workers";
import { canRsvp, formatEventDate } from "../../../lib/content";
import { db, getEvent, purgeExpiredRsvps } from "../../../lib/data";
import { normalizeEmail, rateLimit, rejectCrossOrigin, sendEmail, validEmail } from "../../../lib/security";

function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c)); }
async function confirmation(email: string, title: string, date: string) { await sendEmail(email, `Solaris — rögzítettük a részvételi szándékodat`, `<p>Szia!</p><p>Rögzítettük, hogy szívesen részt vennél ezen a Solaris eseményen: <strong>${escapeHtml(title)}</strong> (${escapeHtml(date)}).</p><p>Ez a jelzés nem helyfoglalás és nem hírlevél-feliratkozás. Az esemény további részleteit a weboldalon találod.</p><p>Találkozunk!<br>Solaris Community</p>`); }

export async function POST(request: Request) {
  const originError = rejectCrossOrigin(request); if (originError) return originError;
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.website) return Response.json({ message: "Köszönjük!" });
    const slug = String(body.slug || ""); const email = normalizeEmail(String(body.email || ""));
    if (!/^[a-z0-9-]{1,80}$/.test(slug) || !validEmail(email)) return Response.json({ message: "Ellenőrizd az e-mail-címet." }, { status: 400 });
    const event = await getEvent(slug);
    if (!event || !canRsvp(event)) return Response.json({ message: "Ehhez az eseményhez most nem lehet jelentkezni." }, { status: 409 });
    if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) return Response.json({ message: "A visszaigazoló e-mail még nincs beállítva. Próbáld később." }, { status: 503 });
    if (!await rateLimit(request, "rsvp", 8, 15)) return Response.json({ message: "Túl sok próbálkozás. Próbáld újra később." }, { status: 429 });
    await purgeExpiredRsvps();
    const existing = await db().prepare("SELECT id, email_status FROM rsvps WHERE event_slug = ? AND email = ?").bind(slug, email).first<{id:string;email_status:string}>();
    if (existing?.email_status === "sent") return Response.json({ message: "Már rögzítettük a részvételi szándékodat." });
    const id = existing?.id || crypto.randomUUID();
    if (!existing) await db().prepare("INSERT INTO rsvps (id, event_slug, email, created_at, email_status) VALUES (?, ?, ?, ?, 'pending')").bind(id, slug, email, new Date().toISOString()).run();
    try { await confirmation(email, event.title, formatEventDate(event.startsAt)); await db().prepare("UPDATE rsvps SET email_status = 'sent' WHERE id = ?").bind(id).run(); return Response.json({ message: "Rögzítettük a részvételi szándékodat. A visszaigazolás e-mailben érkezik; ez nem helyfoglalás." }); }
    catch { await db().prepare("UPDATE rsvps SET email_status = 'failed' WHERE id = ?").bind(id).run(); return Response.json({ message: "A szándékodat rögzítettük, de a visszaigazoló e-mail most nem ment el. Kérjük, próbáld újra később." }, { status: 202 }); }
  } catch { return Response.json({ message: "Most nem tudjuk fogadni a jelentkezést. Próbáld újra később." }, { status: 503 }); }
}
