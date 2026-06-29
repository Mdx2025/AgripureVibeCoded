ALTER TABLE "admins" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "role" text DEFAULT 'admin';