CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL UNIQUE,
	"expires_at" text NOT NULL,
	"used_at" text,
	"created_at" text NOT NULL
);
