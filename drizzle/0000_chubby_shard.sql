CREATE TABLE `admin_codes` (
	`email` text PRIMARY KEY NOT NULL,
	`code_hash` text NOT NULL,
	`expires_at` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`requested_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text DEFAULT '' NOT NULL,
	`starts_at` text,
	`city` text DEFAULT '' NOT NULL,
	`venue` text DEFAULT '' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`cycling` text DEFAULT '' NOT NULL,
	`monarch` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`rsvp_open` integer DEFAULT false NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_events_slug` ON `events` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_events_status_date` ON `events` (`status`,`starts_at`);--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`kind` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_inquiries_created` ON `inquiries` (`created_at`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`event_slug` text NOT NULL,
	`object_key` text NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`credit` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`approved` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_media_event_order` ON `media` (`event_slug`,`sort_order`);--> statement-breakpoint
CREATE TABLE `partners` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`event_slug` text,
	`website` text,
	`logo_key` text,
	`approved` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_partners_event_order` ON `partners` (`event_slug`,`sort_order`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`window_start` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` text PRIMARY KEY NOT NULL,
	`event_slug` text NOT NULL,
	`email` text NOT NULL,
	`created_at` text NOT NULL,
	`email_status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_rsvps_event_email` ON `rsvps` (`event_slug`,`email`);--> statement-breakpoint
CREATE INDEX `idx_rsvps_event_created` ON `rsvps` (`event_slug`,`created_at`);--> statement-breakpoint
CREATE TABLE `site_copy` (
	`key` text PRIMARY KEY NOT NULL,
	`locale` text DEFAULT 'hu' NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`quote` text NOT NULL,
	`author` text NOT NULL,
	`event_slug` text,
	`approved` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_testimonials_approved` ON `testimonials` (`approved`);