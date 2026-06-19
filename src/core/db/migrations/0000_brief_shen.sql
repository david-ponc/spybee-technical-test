CREATE TABLE "incident_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"storage_path" text NOT NULL,
	"public_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"building_id" bigint NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"priority" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"due_date" timestamp with time zone,
	"observations" text,
	"location_details" text,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"assignees" text[] DEFAULT '{}' NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "incident_files" ADD CONSTRAINT "incident_files_incident_id_incidents_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incidents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "incident_files_incident_id_idx" ON "incident_files" USING btree ("incident_id");--> statement-breakpoint
CREATE INDEX "incidents_building_id_idx" ON "incidents" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "incidents_created_by_idx" ON "incidents" USING btree ("created_by");