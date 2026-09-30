import { env } from "cloudflare:workers";
import { purgeExpiredRsvps } from "../../../../lib/data";
import { adminFromRequest, digest } from "../../../../lib/security";
export async function POST(request: Request) { try { const token = request.headers.get("authorization")?.replace(/^Bearer /, "") || ""; const admin = await adminFromRequest(request); if (!admin && (!env.MAINTENANCE_SECRET || !token || await digest(token) !== await digest(env.MAINTENANCE_SECRET))) return Response.json({ message: "Nincs jogosultság." }, { status: 401 }); const result = await purgeExpiredRsvps(); return Response.json({ deleted: result.meta.changes || 0 }); } catch { return Response.json({ message: "A törlés nem sikerült." }, { status: 503 }); } }
