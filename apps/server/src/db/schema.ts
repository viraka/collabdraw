import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  tag: text("tag").notNull().unique(), // ✅ MUST be unique
  passwordHash: text("password_hash").notNull(),
  refreshTokenHash: text("refresh_token_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});
