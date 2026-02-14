// Placeholder for Drizzle schema
// Will be populated in Phase 2 when Docker/PostgreSQL is set up

// export const schema = {};
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  // Language Fields
  nativeLanguage: varchar("native_language", { length: 10 }).notNull(), // e.g., 'en', 'es'
  targetLanguage: varchar("target_language", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Profile Fields
  bio: text("bio"),
  timezone: varchar("timezone", { length: 100 }),
  videoHandles: jsonb("video_handles"),
});
