import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const members = sqliteTable(
  "members",
  {
    userId: text("user_id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    educationTermsAcceptedAt: text("education_terms_accepted_at").notNull(),
    updatesOptIn: integer("updates_opt_in", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_members_email").on(table.email)],
);

export const episodeOverrides = sqliteTable(
  "episode_overrides",
  {
    episodeId: integer("episode_id").primaryKey(),
    status: text("status", { enum: ["enabled", "disabled", "removed"] })
      .notNull()
      .default("enabled"),
    releaseDate: text("release_date"),
    updatedBy: text("updated_by").notNull(),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_episode_overrides_status_date").on(table.status, table.releaseDate)],
);

export const downloadEvents = sqliteTable(
  "download_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    episodeId: integer("episode_id").notNull(),
    audience: text("audience", { enum: ["educator", "parent"] }).notNull(),
    downloadedAt: text("downloaded_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_download_events_user_date").on(table.userId, table.downloadedAt)],
);

export const emailOutbox = sqliteTable(
  "email_outbox",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    recipient: text("recipient").notNull(),
    kind: text("kind", { enum: ["welcome", "weekly-highlight", "monthly-release"] }).notNull(),
    campaignKey: text("campaign_key").notNull(),
    subject: text("subject").notNull(),
    html: text("html").notNull(),
    status: text("status", { enum: ["queued", "sent", "failed"] }).notNull().default("queued"),
    scheduledFor: text("scheduled_for").notNull(),
    sentAt: text("sent_at"),
    lastError: text("last_error"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_email_outbox_member_campaign").on(table.userId, table.campaignKey),
    index("idx_email_outbox_status_schedule").on(table.status, table.scheduledFor),
  ],
);
