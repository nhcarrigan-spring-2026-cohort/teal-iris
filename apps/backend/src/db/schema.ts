import {
  index,
  jsonb,
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// --- Connection Status Enum ---
export const connectionStatusEnum = pgEnum("connection_status", [
  "PENDING",
  "ACCEPTED",
]);

// --- Languages Table ---
export const languages = pgTable("languages", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 2 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  nativeName: varchar("native_name", { length: 100 }).notNull(),
});

// --- Users Table ---
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),

    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
<<<<<<< HEAD
    bio: text("bio"),
    timezone: varchar("timezone", { length: 100 }),
    videoHandles: jsonb("video_handles"),

    emailVerified: timestamp("email_verified"),
    verificationToken: varchar("verification_token", { length: 255 }),
    verificationTokenExpiry: timestamp("verification_token_expiry"),

    nativeLanguageId: uuid("native_language_id")
      .notNull()
      .references(() => languages.id, { onDelete: "restrict" }),

    targetLanguageId: uuid("target_language_id")
      .notNull()
      .references(() => languages.id, { onDelete: "restrict" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
=======

    emailVerified: timestamp("email_verified"),
    verificationToken: varchar("verification_token", { length: 255 }),
    verificationTokenExpiry: timestamp("verification_token_expiry"),

    nativeLanguageId: uuid("native_language_id")
      .notNull()
      .references(() => languages.id, { onDelete: "restrict" }),

    targetLanguageId: uuid("target_language_id")
      .notNull()
      .references(() => languages.id, { onDelete: "restrict" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    bio: text("bio"),
    timezone: varchar("timezone", { length: 100 }),

    // ✅ FIX: Strongly type JSONB column
    videoHandles: jsonb("video_handles")
      .$type<string[]>()
      .notNull()
      .default([]),
>>>>>>> f799e67 (feat(backend): finalize global api auth wiring)
  },
  (table) => [
    index("users_native_language_id_idx").on(table.nativeLanguageId),
    index("users_target_language_id_idx").on(table.targetLanguageId),
  ],
);// --- Users Table ---
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),

    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    bio: text("bio"),
    timezone: varchar("timezone", { length: 100 }),

    // ✅ Strongly typed JSONB column for video handles
    videoHandles: jsonb("video_handles")
      .$type<string[]>()
      .notNull()
      .default([]),

    emailVerified: timestamp("email_verified"),
    verificationToken: varchar("verification_token", { length: 255 }),
    verificationTokenExpiry: timestamp("verification_token_expiry"),

    nativeLanguageId: uuid("native_language_id")
      .notNull()
      .references(() => languages.id, { onDelete: "restrict" }),

    targetLanguageId: uuid("target_language_id")
      .notNull()
      .references(() => languages.id, { onDelete: "restrict" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("users_native_language_id_idx").on(table.nativeLanguageId),
    index("users_target_language_id_idx").on(table.targetLanguageId),
  ],
);

// --- Connections Table ---
export const connections = pgTable(
  "connections",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    status: connectionStatusEnum("status")
      .default("PENDING")
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("connections_sender_id_idx").on(table.senderId),
    index("connections_receiver_id_idx").on(table.receiverId),
  ],
);