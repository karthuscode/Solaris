import { db } from "../../../lib/data";
import { normalizeEmail, rateLimit, rejectCrossOrigin, validEmail } from "../../../lib/security";

export async function POST(request: Request) {
  const originError = rejectCrossOrigin(request); if (originError) return originError;
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.website) return Response.json({ message: "Köszönjük az üzenetedet." });
    const name = String(body.name || "").trim(); const email = normalizeEmail(String(body.email || ""));
    const kind = String(body.kind || ""); const message = String(body.message || "").trim();
    if (!name || name.length > 120 || !validEmail(email) || !["partner", "sponsor", "performer", "other"].includes(kind) || message.length < 10 || message.length > 3000) return Response.json({ message: "Ellenőrizd a megadott adatokat." }, { status: 400 });
    if (!await rateLimit(request, "contact", 5, 15)) return Response.json({ message: "Túl sok üzenet érkezett. Próbáld újra később." }, { status: 429 });
    await db().prepare("INSERT INTO inquiries (id, name, email, kind, message, created_at, status) VALUES (?, ?, ?, ?, ?, ?, 'new')").bind(crypto.randomUUID(), name, email, kind, message, new Date().toISOString()).run();
    return Response.json({ message: "Köszönjük! Megkaptuk az üzenetedet." });
  } catch { return Response.json({ message: "Most nem tudjuk fogadni az üzenetet. Próbáld újra később." }, { status: 503 }); }
}
