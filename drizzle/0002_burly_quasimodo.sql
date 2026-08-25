CREATE TABLE `site_notices` (
	`id` text PRIMARY KEY NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`message` text NOT NULL,
	`link_label` text,
	`link_href` text,
	`tone` text DEFAULT 'sage' NOT NULL,
	`starts_at` text,
	`ends_at` text,
	`updated_by` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `site_notices` (`id`, `enabled`, `message`, `link_label`, `link_href`, `tone`, `updated_by`)
VALUES ('main', 1, 'Six illustrated Story eBooks are ready for shared reading.', 'Explore the Story eBooks', '/ebooks', 'sage', 'system-launch');
