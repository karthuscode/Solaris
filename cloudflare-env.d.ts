declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ADMIN_EMAILS?: string;
    ADMIN_SESSION_SECRET?: string;
    BREVO_API_KEY?: string;
    BREVO_SENDER_EMAIL?: string;
    BREVO_SENDER_NAME?: string;
    MAINTENANCE_SECRET?: string;
    PUBLIC_LAUNCH_READY?: string;
    PUBLIC_SITE_URL?: string;
  }
}
