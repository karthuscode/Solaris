# Project status

**As of 30 September 2026:** implemented and deployed as a private owner-only preview. The screenshots show the current interface, including draft event content.

## Implemented

- Responsive home page with a scroll-led Community → Cycling → Monarch story and reduced-motion support.
- Events index and detail pages, About, Contact and a provisional privacy page.
- Organizer tools for events, copy, partners, images, video links, approved quotes, attendance lists, CSV exports and inquiries.
- D1 records, R2 media, approval-aware image delivery and email-only attendance intent with duplicate prevention.
- Organizer email-code authentication and Brevo transactional email integration, pending production configuration.
- Search metadata and launch-dependent indexing controls.

## Verification performed

TypeScript checks and the Worker build passed. The UI was checked on desktop and mobile, with keyboard navigation and reduced motion. Local API checks covered unauthorized/authorized organizer access, content editing, event rendering, missing-email-service failure, contact storage, CSV export, image approval and deletion, and removal of an expired attendance record. The private deployment succeeded and its database tables were verified.

These are manual checks, not an automated regression suite. Production email delivery is unverified while the sender credentials are absent.

## Before public launch

- Provide the public contact address and the actual data controller details; approve the final privacy notice.
- Configure 1–2 organizer email addresses and an authenticated transactional sender.
- Verify the first event's date, places, program and partners with its organizers.
- Supply approved event photographs, video links and partner logos.
- Attach a daily scheduler to the protected retention endpoint; traffic-triggered cleanup alone cannot guarantee the deadline.
- Connect the desired domain and explicitly approve public access.

The pending next event displays “szervezés alatt”. No participant testimonials have been invented. The initial event draft is based on the [public Visit Harghita description](https://www.visitharghita.ro/hu/events/solaris-days-1-critical-mass-x-matin) and remains subject to organizer approval.
