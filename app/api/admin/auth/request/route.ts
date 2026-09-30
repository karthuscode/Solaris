import { db } from "../../../../../lib/data";
import { authMessage, digest, isAdminEmail, normalizeEmail, rateLimit, rejectCrossOrigin, sendEmail, validEmail } from "../../../../../lib/security";

export async function POST(request: Request) {
  const error = rejectCrossOrigin(request); if (error) return error;
  try {
    const body = await request.json() as { email?: string };
    const email = normalizeEmail(body.email || "");
    if (!validEmail(email)) return Response.json({ message: authMessage });
    if (!await rateLimit(request, "admin-code", 3, 15)) return Response.json({ message: authMessage });
    if (!isAdminEmail(email)) return Response.json({ message: authMessage });
    const current = await db().prepare("SELECT requested_at FROM admin_codes WHERE email = ?").bind(email).first<{requested_at:string}>();
    if (current && Date.now() - new Date(current.requested_at).getTime() < 60000) return Response.json({ message: authMessage });
    const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
    await db().prepare("INSERT INTO admin_codes (email, code_hash, expires_at, attempts, requested_at) VALUES (?, ?, ?, 0, ?) ON CONFLICT(email) DO UPDATE SET code_hash = excluded.code_hash, expires_at = excluded.expires_at, attempts = 0, requested_at = excluded.requested_at").bind(email, await digest(`${email}:${code}`), new Date(Date.now() + 10 * 60000).toISOString(), new Date().toISOString()).run();
    try { await sendEmail(email, "Solaris szervezői belépési kód", `<p>A belépési kódod: <strong>${code}</strong></p><p>10 percig érvényes. Ha nem te kérted, hagyd figyelmen kívül ezt az üzenetet.</p>`); }
    catch { await db().prepare("DELETE FROM admin_codes WHERE email = ?").bind(email).run(); return Response.json({ message: "A belépési e-mail most nem küldhető. Próbáld újra később." }, { status: 503 }); }
    return Response.json({ message: authMessage });
  } catch { return Response.json({ message: "A belépés jelenleg nem érhető el." }, { status: 503 }); }
}
