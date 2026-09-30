CREATE TABLE `event_translations` (
	`event_slug` text NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text DEFAULT '' NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`cycling` text DEFAULT '' NOT NULL,
	`monarch` text DEFAULT '' NOT NULL,
	PRIMARY KEY(`event_slug`, `locale`)
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_site_copy` (
	`key` text NOT NULL,
	`locale` text DEFAULT 'hu' NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`key`, `locale`)
);
--> statement-breakpoint
INSERT INTO `__new_site_copy`("key", "locale", "value", "updated_at") SELECT "key", "locale", "value", "updated_at" FROM `site_copy`;--> statement-breakpoint
DROP TABLE `site_copy`;--> statement-breakpoint
ALTER TABLE `__new_site_copy` RENAME TO `site_copy`;--> statement-breakpoint
PRAGMA foreign_keys=ON;