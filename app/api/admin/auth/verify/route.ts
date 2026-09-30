import { db } from "../../../../../lib/data";
import { digest, isAdminEmail, issueSession, normalizeEmail, rateLimit, rejectCrossOrigin, sessionCookie, validEmail } from "../../../../../lib/security";

export async function POST(request: Request) {
  const error = rejectCrossOrigin(request); if (error) return error;
  try {
    const body = await request.json() as { email?: string; code?: string };
    const email = normalizeEmail(body.email || ""); const code = String(body.code || "");
    if (!validEmail(email) || !/^\d{6}$/.test(code) || !isAdminEmail(email)) return Response.json({ message: "Érvénytelen vagy lejárt kód." }, { status: 401 });
    if (!await rateLimit(request, "admin-verify", 10, 15)) return Response.json({ message: "Túl sok próbálkozás." }, { status: 429 });
    const row = await db().prepare("SELECT code_hash, expires_at, attempts FROM admin_codes WHERE email = ?").bind(email).first<{code_hash:string;expires_at:string;attempts:number}>();
    if (!row || row.expires_at < new Date().toISOString() || row.attempts >= 5) return Response.json({ message: "Érvénytelen vagy lejárt kód." }, { status: 401 });
    await db().prepare("UPDATE admin_codes SET attempts = attempts + 1 WHERE email = ?").bind(email).run();
    if (await digest(`${email}:${code}`) !== row.code_hash) return Response.json({ message: "Érvénytelen vagy lejárt kód." }, { status: 401 });
    await db().prepare("DELETE FROM admin_codes WHERE email = ?").bind(email).run();
    return Response.json({ message: "Sikeres belépés." }, { headers: { "Set-Cookie": sessionCookie(await issueSession(email)) } });
  } catch { return Response.json({ message: "A belépés jelenleg nem érhető el." }, { status: 503 }); }
}
