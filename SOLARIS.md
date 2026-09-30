# Solaris Community site

Private preview of the Hungarian Solaris Community site. The public launch is deliberately gated by the Sites access policy and `PUBLIC_LAUNCH_READY=0`.

## What is implemented

- Scroll-led Community → Cycling → Monarch introduction with reduced-motion fallback, responsive navigation, brand assets and self-hosted Inter.
- Event list and detail pages, factual first-event draft, gallery and approved video/partner content.
- Event-specific email-only attendance intent, idempotent per event/email, transactional confirmation via Brevo, contact inquiry form.
- Unified organizer area at `/admin`: events, copy, partners and logos, photos, videos, consented quotes, RSVP list/CSV, inquiries.
- D1 structured records, R2 images, server-side allowlist plus one-time email codes, rate limiting, same-origin checks and image approval.

## Runtime configuration

Set these in Sites environment variables, keeping secrets marked secret:

| Key | Purpose |
| --- | --- |
| `ADMIN_EMAILS` | Comma-separated invited organizer addresses. No admin login works until set. |
| `ADMIN_SESSION_SECRET` | At least 32 random characters; signs sessions, code hashes and rate-limit keys. |
| `BREVO_API_KEY` | Transactional e-mail API credential. |
| `BREVO_SENDER_EMAIL` | Verified sender address; needed for organizer codes and RSVP confirmations. |
| `BREVO_SENDER_NAME` | Optional display name. |
| `MAINTENANCE_SECRET` | Secret bearer for the retention endpoint. |
| `PUBLIC_LAUNCH_READY` | `0` for private review; `1` only after content/legal checks and public access change. |
| `PUBLIC_SITE_URL` | Canonical origin, later the custom domain. |

The site is private and noindexed by default. Keep it private until the actual data controller, public contact email, privacy notice, media rights, partner approval, event details, organizer emails and sender domain are verified. Replace the provisional privacy page before public launch.

## Retention

Expired RSVP addresses are removed when event pages, the organizer state, export or RSVP route runs. `POST /api/maintenance/purge` runs the same deletion with `Authorization: Bearer <MAINTENANCE_SECRET>`. A daily independent scheduler still needs to be connected before public launch to guarantee deletion even when the site receives no visits. The current Sites connector does not expose a cron setup action. Never put the bearer in source or a public URL.

## Development

Run `npm run dev` for the visual preview. Generate migrations with `npm run db:generate`; use the instructions in `docs/development.md` to apply them to local D1. Run `node /path/to/sites/scripts/build-site.mjs` for a Worker build. The user-facing site is published privately through the Sites workflow; do not publish public access until the launch checklist above is complete.
