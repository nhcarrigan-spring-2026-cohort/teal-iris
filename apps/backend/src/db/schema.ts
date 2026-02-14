// Placeholder for Drizzle schema
// Will be populated in Phase 2 when Docker/PostgreSQL is set up

// export const schema = {};
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

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
});

export const languages = pgTable("languages", {
  code: varchar("code", { length: 2 }).primaryKey(), // ISO 639-1
  name: varchar("name", { length: 100 }).notNull(),
  nativeName: varchar("native_name", { length: 100 }).notNull(),
});
