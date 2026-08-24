CREATE TABLE `download_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`episode_id` integer NOT NULL,
	`audience` text NOT NULL,
	`downloaded_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_download_events_user_date` ON `download_events` (`user_id`,`downloaded_at`);--> statement-breakpoint
CREATE TABLE `episode_overrides` (
	`episode_id` integer PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'enabled' NOT NULL,
	`release_date` text,
	`updated_by` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_episode_overrides_status_date` ON `episode_overrides` (`status`,`release_date`);--> statement-breakpoint
CREATE TABLE `members` (
	`user_id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`education_terms_accepted_at` text NOT NULL,
	`updates_opt_in` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_members_email` ON `members` (`email`);