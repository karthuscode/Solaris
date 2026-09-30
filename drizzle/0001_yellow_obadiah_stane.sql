CREATE TABLE `video_links` (
	`id` text PRIMARY KEY NOT NULL,
	`event_slug` text NOT NULL,
	`url` text NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`approved` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_video_links_event` ON `video_links` (`event_slug`);