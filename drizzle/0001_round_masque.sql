CREATE TABLE `email_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`recipient` text NOT NULL,
	`kind` text NOT NULL,
	`campaign_key` text NOT NULL,
	`subject` text NOT NULL,
	`html` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`scheduled_for` text NOT NULL,
	`sent_at` text,
	`last_error` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_email_outbox_member_campaign` ON `email_outbox` (`user_id`,`campaign_key`);--> statement-breakpoint
CREATE INDEX `idx_email_outbox_status_schedule` ON `email_outbox` (`status`,`scheduled_for`);