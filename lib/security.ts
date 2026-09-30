import { env } from "cloudflare:workers";
import { db } from "./data";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const cookieName = "solaris_admin";
const genericAuth = "Ha a cím jogosult, elküldtük a belépési kódot.";
export const authMessage = genericAuth;

function secret() { if (!env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32) throw new Error("ADMIN_SECRET_NOT_CONFIGURED"); return env.ADMIN_SESSION_SECRET; }
function allowed(email: string) { return (env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).includes(email); }
export function normalizeEmail(raw: string) { return raw.trim().toLowerCase(); }
export function validEmail(value: string) { return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function base64url(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""); }
function unbase64url(value: string) { const s = value.replace(/-/g, "+").replace(/_/g, "/"); return Uint8Array.from(atob(s + "=".repeat((4 - s.length % 4) % 4)), (c) => c.charCodeAt(0)); }
async function sign(value: string) { const key = await crypto.subtle.importKey("raw", encoder.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return base64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)))); }
export async function digest(value: string) { return sign(value); }
export function sameOrigin(request: Request) { const origin = request.headers.get("origin"); if (!origin) return false; try { return new URL(origin).host === new URL(request.url).host; } catch { return false; } }
export function rejectCrossOrigin(request: Request) { return !sameOrigin(request) ? Response.json({ message: "Érvénytelen kérés." }, { status: 403 }) : null; }

export async function issueSession(email: string) { const payload = base64url(encoder.encode(JSON.stringify({ email, exp: Date.now() + 12 * 60 * 60 * 1000, nonce: crypto.randomUUID() }))); return `${payload}.${await sign(payload)}`; }
export function sessionCookie(token: string) { return `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`; }
export function logoutCookie() { return `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`; }
export async function adminFromRequest(request: Request): Promise<string | null> {
  try {
    const cookie = request.headers.get("cookie") || "";
    const token = cookie.split(";").map((x) => x.trim()).find((x) => x.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
    if (!token) return null;
    const [payload, mac] = token.split(".");
    if (!payload || !mac || await sign(payload) !== mac) return null;
    const data = JSON.parse(decoder.decode(unbase64url(payload))) as { email: string; exp: number };
    return data.exp > Date.now() && allowed(data.email) ? data.email : null;
  } catch { return null; }
}
export async function requireAdmin(request: Request) { const email = await adminFromRequest(request); return email ? null : Response.json({ message: "Szervezői belépés szükséges." }, { status: 401 }); }
export function isAdminEmail(email: string) { return allowed(email); }

export async function rateLimit(request: Request, action: string, limit = 5, minutes = 15) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const key = await digest(`${action}:${ip}`);
  const now = new Date(); const start = new Date(now.getTime() - minutes * 60000).toISOString();
  const old = await db().prepare("SELECT window_start, count FROM rate_limits WHERE key = ?").bind(key).first<{ window_start: string; count: number }>();
  if (old && old.window_start > start && old.count >= limit) return false;
  if (!old || old.window_start <= start) await db().prepare("INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET window_start = excluded.window_start, count = 1").bind(key, now.toISOString()).run();
  else await db().prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?").bind(key).run();
  return true;
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) throw new Error("MAIL_NOT_CONFIGURED");
  const r = await fetch("https://api.brevo.com/v3/smtp/email", { method: "POST", headers: { "Content-Type": "application/json", "api-key": env.BREVO_API_KEY }, body: JSON.stringify({ sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME || "Solaris Community" }, to: [{ email: to }], subject, htmlContent: html }) });
  if (!r.ok) throw new Error(`MAIL_SEND_FAILED_${r.status}`);
}
