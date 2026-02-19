ALTER TABLE "languages" ALTER COLUMN "native_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_token" varchar(255);