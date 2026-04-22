import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Contact submissions inbox for storefront /contact form.
 *
 * Draft/published uses `enum_contact_submissions_status` (Payload convention).
 * Inbox workflow uses `enum_contact_submissions_submission_status` so it does not
 * collide with a field named `status` (forbidden with Postgres + versions.drafts).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_contact_submissions_status" AS ENUM('draft','published');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum__contact_submissions_v_version_status" AS ENUM('draft','published');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_contact_submissions_submission_status" AS ENUM('new','in_progress','resolved','spam');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum__contact_submissions_v_version_submission_status" AS ENUM('new','in_progress','resolved','spam');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  CREATE TABLE IF NOT EXISTS "contact_submissions" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "message" varchar NOT NULL,
    "honeypot_triggered" boolean DEFAULT false,
    "ip_hash" varchar,
    "user_agent" varchar,
    "submission_status" "enum_contact_submissions_submission_status" DEFAULT 'new' NOT NULL,
    "handled_by_id" integer,
    "notes" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_contact_submissions_status" DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS "_contact_submissions_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_name" varchar,
    "version_email" varchar,
    "version_message" varchar,
    "version_honeypot_triggered" boolean DEFAULT false,
    "version_ip_hash" varchar,
    "version_user_agent" varchar,
    "version_submission_status" "enum__contact_submissions_v_version_submission_status" DEFAULT 'new',
    "version_handled_by_id" integer,
    "version_notes" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__contact_submissions_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  DO $$ BEGIN
    ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_handled_by_id_users_id_fk"
      FOREIGN KEY ("handled_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    ALTER TABLE "_contact_submissions_v" ADD CONSTRAINT "_contact_submissions_v_parent_id_contact_submissions_id_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."contact_submissions"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    ALTER TABLE "_contact_submissions_v" ADD CONSTRAINT "_contact_submissions_v_version_handled_by_id_users_id_fk"
      FOREIGN KEY ("version_handled_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  CREATE INDEX IF NOT EXISTS "contact_submissions_email_idx" ON "contact_submissions" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "contact_submissions_ip_hash_idx" ON "contact_submissions" USING btree ("ip_hash");
  CREATE INDEX IF NOT EXISTS "contact_submissions_submission_status_idx" ON "contact_submissions" USING btree ("submission_status");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "contact_submissions_submission_status_idx";
  DROP INDEX IF EXISTS "contact_submissions_ip_hash_idx";
  DROP INDEX IF EXISTS "contact_submissions_email_idx";

  DROP TABLE IF EXISTS "_contact_submissions_v" CASCADE;
  DROP TABLE IF EXISTS "contact_submissions" CASCADE;

  DO $$ BEGIN DROP TYPE "public"."enum__contact_submissions_v_version_submission_status";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_contact_submissions_submission_status";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__contact_submissions_v_version_status";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_contact_submissions_status";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  `)
}
