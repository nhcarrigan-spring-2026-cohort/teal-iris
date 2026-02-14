import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const languages = pgTable("languages", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 2 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  nativeName: varchar("native_name", { length: 100 }).notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  nativeLanguageId: uuid("native_language_id")
    .notNull()
    .references(() => languages.id),
  targetLanguageId: uuid("target_language_id")
    .notNull()
    .references(() => languages.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
