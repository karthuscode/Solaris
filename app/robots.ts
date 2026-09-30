import type { MetadataRoute } from "next";
import { env } from "cloudflare:workers";
export default function robots(): MetadataRoute.Robots { const live = env.PUBLIC_LAUNCH_READY === "1"; return { rules: live ? { userAgent: "*", allow: "/", disallow: "/admin" } : { userAgent: "*", disallow: "/" }, sitemap: live ? `${env.PUBLIC_SITE_URL || "https://solaris-community.karthuss.chatgpt.site"}/sitemap.xml` : undefined }; }
