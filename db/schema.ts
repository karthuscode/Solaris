import { integer, sqliteTable, text, uniqueIndex, index, primaryKey } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  startsAt: text("starts_at"),
  city: text("city").notNull().default(""),
  venue: text("venue").notNull().default(""),
  summary: text("summary").notNull().default(""),
  cycling: text("cycling").notNull().default(""),
  monarch: text("monarch").notNull().default(""),
  status: text("status").notNull().default("draft"),
  rsvpOpen: integer("rsvp_open", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull(),
}, (t) => [uniqueIndex("idx_events_slug").on(t.slug), index("idx_events_status_date").on(t.status, t.startsAt)]);

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  eventSlug: text("event_slug").notNull(),
  objectKey: text("object_key").notNull(),
  caption: text("caption").notNull().default(""),
  credit: text("credit").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
}, (t) => [index("idx_media_event_order").on(t.eventSlug, t.sortOrder)]);

export const partners = sqliteTable("partners", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  eventSlug: text("event_slug"),
  website: text("website"),
  logoKey: text("logo_key"),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [index("idx_partners_event_order").on(t.eventSlug, t.sortOrder)]);

export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  eventSlug: text("event_slug"),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
}, (t) => [index("idx_testimonials_approved").on(t.approved)]);

export const videoLinks = sqliteTable("video_links", {
  id: text("id").primaryKey(),
  eventSlug: text("event_slug").notNull(),
  url: text("url").notNull(),
  caption: text("caption").notNull().default(""),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
}, (t) => [index("idx_video_links_event").on(t.eventSlug)]);

export const siteCopy = sqliteTable("site_copy", {
  key: text("key").notNull(),
  locale: text("locale").notNull().default("hu"),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (t) => [primaryKey({ columns: [t.key, t.locale] })]);

export const eventTranslations = sqliteTable("event_translations", {
  eventSlug: text("event_slug").notNull(),
  locale: text("locale").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  summary: text("summary").notNull().default(""),
  cycling: text("cycling").notNull().default(""),
  monarch: text("monarch").notNull().default(""),
}, (t) => [primaryKey({ columns: [t.eventSlug, t.locale] })]);

export const rsvps = sqliteTable("rsvps", {
  id: text("id").primaryKey(),
  eventSlug: text("event_slug").notNull(),
  email: text("email").notNull(),
  createdAt: text("created_at").notNull(),
  emailStatus: text("email_status").notNull().default("pending"),
}, (t) => [uniqueIndex("idx_rsvps_event_email").on(t.eventSlug, t.email), index("idx_rsvps_event_created").on(t.eventSlug, t.createdAt)]);

export const inquiries = sqliteTable("inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  kind: text("kind").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
  status: text("status").notNull().default("new"),
}, (t) => [index("idx_inquiries_created").on(t.createdAt)]);

export const adminCodes = sqliteTable("admin_codes", {
  email: text("email").primaryKey(),
  codeHash: text("code_hash").notNull(),
  expiresAt: text("expires_at").notNull(),
  attempts: integer("attempts").notNull().default(0),
  requestedAt: text("requested_at").notNull(),
});

export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  windowStart: text("window_start").notNull(),
  count: integer("count").notNull().default(0),
});
