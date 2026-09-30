import type { MetadataRoute } from "next";
import { env } from "cloudflare:workers";
import { getEvents } from "../lib/data";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { if (env.PUBLIC_LAUNCH_READY !== "1") return []; const base = env.PUBLIC_SITE_URL || "https://solaris-community.karthuss.chatgpt.site"; const events = await getEvents(); return ["", "/esemenyek", "/rolunk", "/kapcsolat", ...events.filter((e) => e.status === "published").map((e) => `/esemenyek/${e.slug}`)].map((path) => ({ url: base + path, lastModified: new Date() })); }
