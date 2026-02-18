import {
  index,
  jsonb,
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const languages = pgTable("languages", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 2 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  nativeName: varchar("native_name", { length: 100 }).notNull(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    nativeLanguageId: uuid("native_language_id")
      .notNull()
      .references(() => languages.id, { onDelete: "restrict" }),
    targetLanguageId: uuid("target_language_id")
      .notNull()
      .references(() => languages.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    // Profile fields
    bio: text("bio"),
    timezone: varchar("timezone", { length: 100 }),
    videoHandles: jsonb("video_handles"),
  },
  (table) => [
    index("users_native_language_id_idx").on(table.nativeLanguageId),
    index("users_target_language_id_idx").on(table.targetLanguageId),
  ],
);
