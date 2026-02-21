CREATE TYPE "public"."connection_status" AS ENUM('PENDING', 'ACCEPTED');--> statement-breakpoint
CREATE TABLE "connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"status" "connection_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'languages'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "languages" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "languages" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "native_language_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "target_language_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "timezone" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "video_handles" jsonb;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "connections_sender_id_idx" ON "connections" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "connections_receiver_id_idx" ON "connections" USING btree ("receiver_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_native_language_id_languages_id_fk" FOREIGN KEY ("native_language_id") REFERENCES "public"."languages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_target_language_id_languages_id_fk" FOREIGN KEY ("target_language_id") REFERENCES "public"."languages"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_native_language_id_idx" ON "users" USING btree ("native_language_id");--> statement-breakpoint
CREATE INDEX "users_target_language_id_idx" ON "users" USING btree ("target_language_id");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "native_language";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "target_language";--> statement-breakpoint
ALTER TABLE "languages" ADD CONSTRAINT "languages_code_unique" UNIQUE("code");