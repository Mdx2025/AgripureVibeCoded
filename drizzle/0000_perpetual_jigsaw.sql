CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"business" text,
	"address" text,
	"password" text,
	"created_at" text,
	CONSTRAINT "accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"status" text,
	"dateCreated" text
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"company" text,
	"clientName" text,
	"email" text,
	"address" text,
	"dateCreated" text
);
--> statement-breakpoint
CREATE TABLE "crop_formulas" (
	"id" text PRIMARY KEY NOT NULL,
	"crop" text,
	"crop_id" text,
	"line" text,
	"line_code" text,
	"primary_remedy" text,
	"potency" text,
	"blend" text,
	"targets" text,
	"rate" text,
	"method" text,
	"stage" text,
	"cadence" text,
	"lab_note" text
);
--> statement-breakpoint
CREATE TABLE "crop_pricing_overrides" (
	"crop_id" text PRIMARY KEY NOT NULL,
	"conventional" integer,
	"organic" integer,
	"list" integer,
	"updated_at" text
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"op" text,
	"location" text,
	"crop" text,
	"orders" integer,
	"ltv" text,
	"avColor" text
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" text PRIMARY KEY NOT NULL,
	"section" text,
	"product" text,
	"status" text,
	"questions" text
);
--> statement-breakpoint
CREATE TABLE "formulas" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"productLine" text,
	"crop" text,
	"description" text,
	"targetPests" text,
	"targetDiseases" text,
	"applicationMethod" text,
	"dosage" text,
	"unitPrice" integer,
	"remedies" text,
	"status" text,
	"dateCreated" text
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"customer" text,
	"op" text,
	"product" text,
	"date" text,
	"total" text,
	"status" text,
	"created_at" text,
	"payment" text DEFAULT 'Pending',
	"lab_production" text DEFAULT 'Queued',
	"recurring" integer DEFAULT 0,
	"items" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"num" text,
	"name" text,
	"category" text,
	"type" text,
	"grp" text,
	"accent" text,
	"accentSoft" text,
	"band" text,
	"price" integer,
	"sku" text,
	"rating" double precision,
	"reviews" integer,
	"stock" integer,
	"cap" integer,
	"tagline" text,
	"blurb" text,
	"long" text,
	"npk" text,
	"ph" text,
	"omri" text,
	"rate" text,
	"crops" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "proven_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"metric1Label" text,
	"metric1Value" text,
	"metric2Label" text,
	"metric2Value" text,
	"linkedOrder" text,
	"status" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" text PRIMARY KEY NOT NULL,
	"number" text,
	"account_id" text,
	"customer_name" text,
	"customer_email" text,
	"acres" integer,
	"total" integer,
	"effective" integer,
	"payload" text,
	"soil_total" integer DEFAULT 0,
	"soil_price" integer DEFAULT 0,
	"status" text,
	"payment_status" text,
	"payment_method" text,
	"created_at" text
);
--> statement-breakpoint
CREATE TABLE "remedies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"recurring" integer,
	"status" text,
	"dateCreated" text
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"role" text,
	"status" text,
	"sort" integer
);
--> statement-breakpoint
CREATE INDEX "idx_crop_formulas_crop" ON "crop_formulas" USING btree ("crop");