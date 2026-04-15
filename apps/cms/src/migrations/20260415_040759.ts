import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Incremental migration for storefront roadmap (specs, video, FAQ blocks, homepage global,
 * product reviews, services booking, stores region). Assumes `20260413_010115` and
 * `20260413_120000` are already applied (posts + product availability exist).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_products_specs_lens_type" AS ENUM('single-vision', 'progressive', 'photochromic', 'polarized', 'other');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_products_specs_lens_material" AS ENUM('cr39', 'polycarbonate', 'high-index', 'other');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_products_specs_lens_treatment" AS ENUM('anti-reflective', 'blue-light', 'uv', 'scratch-resistant', 'none');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_products_specs_frame_material" AS ENUM('acetate', 'metal', 'titanium', 'mixed', 'other');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__products_v_version_specs_lens_type" AS ENUM('single-vision', 'progressive', 'photochromic', 'polarized', 'other');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__products_v_version_specs_lens_material" AS ENUM('cr39', 'polycarbonate', 'high-index', 'other');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__products_v_version_specs_lens_treatment" AS ENUM('anti-reflective', 'blue-light', 'uv', 'scratch-resistant', 'none');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__products_v_version_specs_frame_material" AS ENUM('acetate', 'metal', 'titanium', 'mixed', 'other');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_product_reviews_status" AS ENUM('draft', 'published');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__product_reviews_v_version_status" AS ENUM('draft', 'published');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_services_service_type" AS ENUM('exam', 'fitting', 'adjustments', 'other');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__services_v_version_service_type" AS ENUM('exam', 'fitting', 'adjustments', 'other');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  CREATE TABLE IF NOT EXISTS "product_reviews" (
    "id" serial PRIMARY KEY NOT NULL,
    "product_id" integer NOT NULL,
    "rating" numeric NOT NULL,
    "title" varchar NOT NULL,
    "body" jsonb,
    "author_name" varchar NOT NULL,
    "verified" boolean DEFAULT false,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_product_reviews_status" DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS "_product_reviews_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_product_id" integer,
    "version_rating" numeric,
    "version_title" varchar,
    "version_body" jsonb,
    "version_author_name" varchar,
    "version_verified" boolean DEFAULT false,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__product_reviews_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE IF NOT EXISTS "pages_blocks_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar
  );

  CREATE TABLE IF NOT EXISTS "pages_blocks_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar,
    "_uuid" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "heading" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "homepage_blocks_hero_module" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "eyebrow" varchar,
    "heading" varchar NOT NULL,
    "subheading" varchar,
    "image_id" integer,
    "cta_label" varchar,
    "cta_href" varchar,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "homepage_blocks_collection_spotlight" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar NOT NULL,
    "sub_heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "homepage_blocks_product_row" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar NOT NULL,
    "sub_heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "homepage_blocks_journal_feature" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar NOT NULL,
    "sub_heading" varchar,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "homepage_blocks_seasonal_banner" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar NOT NULL,
    "body" varchar,
    "background_image_id" integer,
    "link_label" varchar,
    "link_href" varchar,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "homepage" (
    "id" serial PRIMARY KEY NOT NULL,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "homepage_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "product_collections_id" integer,
    "products_id" integer,
    "posts_id" integer
  );

  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_show_specs_on_pdp" boolean DEFAULT true;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_bridge_mm" numeric;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_temple_mm" numeric;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_lens_width_mm" numeric;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_lens_height_mm" numeric;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_lens_type" "enum_products_specs_lens_type";
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_lens_material" "enum_products_specs_lens_material";
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_lens_treatment" "enum_products_specs_lens_treatment";
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_frame_material" "enum_products_specs_frame_material";
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_fit_notes" varchar;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_face_shape_hints" varchar;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "specs_dimension_diagram_id" integer;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "video_poster_id" integer;

  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_show_specs_on_pdp" boolean DEFAULT true;
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_bridge_mm" numeric;
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_temple_mm" numeric;
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_lens_width_mm" numeric;
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_lens_height_mm" numeric;
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_lens_type" "enum__products_v_version_specs_lens_type";
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_lens_material" "enum__products_v_version_specs_lens_material";
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_lens_treatment" "enum__products_v_version_specs_lens_treatment";
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_frame_material" "enum__products_v_version_specs_frame_material";
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_fit_notes" varchar;
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_face_shape_hints" varchar;
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_specs_dimension_diagram_id" integer;
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_video_url" varchar;
  ALTER TABLE "_products_v" ADD COLUMN IF NOT EXISTS "version_video_poster_id" integer;

  ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "region" varchar;
  ALTER TABLE "_stores_v" ADD COLUMN IF NOT EXISTS "version_region" varchar;

  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "service_type" "enum_services_service_type" DEFAULT 'other';
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "booking_url" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "booking_phone" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "primary_cta_label" varchar DEFAULT 'Book appointment';
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_service_type" "enum__services_v_version_service_type" DEFAULT 'other';
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_booking_url" varchar;
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_booking_phone" varchar;
  ALTER TABLE "_services_v" ADD COLUMN IF NOT EXISTS "version_primary_cta_label" varchar DEFAULT 'Book appointment';

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "product_reviews_id" integer;
  DO $$ BEGIN
    ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "_product_reviews_v" ADD CONSTRAINT "_product_reviews_v_parent_id_product_reviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_reviews"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "_product_reviews_v" ADD CONSTRAINT "_product_reviews_v_version_product_id_products_id_fk" FOREIGN KEY ("version_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_blocks_hero_module" ADD CONSTRAINT "homepage_blocks_hero_module_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_blocks_hero_module" ADD CONSTRAINT "homepage_blocks_hero_module_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_blocks_collection_spotlight" ADD CONSTRAINT "homepage_blocks_collection_spotlight_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_blocks_product_row" ADD CONSTRAINT "homepage_blocks_product_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_blocks_journal_feature" ADD CONSTRAINT "homepage_blocks_journal_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_blocks_seasonal_banner" ADD CONSTRAINT "homepage_blocks_seasonal_banner_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_blocks_seasonal_banner" ADD CONSTRAINT "homepage_blocks_seasonal_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_product_collections_fk" FOREIGN KEY ("product_collections_id") REFERENCES "public"."product_collections"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "products" ADD CONSTRAINT "products_specs_dimension_diagram_id_media_id_fk" FOREIGN KEY ("specs_dimension_diagram_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "products" ADD CONSTRAINT "products_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_specs_dimension_diagram_id_media_id_fk" FOREIGN KEY ("version_specs_dimension_diagram_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_video_poster_id_media_id_fk" FOREIGN KEY ("version_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_reviews_fk" FOREIGN KEY ("product_reviews_id") REFERENCES "public"."product_reviews"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  CREATE INDEX IF NOT EXISTS "product_reviews_product_idx" ON "product_reviews" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "product_reviews_updated_at_idx" ON "product_reviews" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "product_reviews_created_at_idx" ON "product_reviews" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "product_reviews__status_idx" ON "product_reviews" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_product_reviews_v_parent_idx" ON "_product_reviews_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_product_reviews_v_version_version_product_idx" ON "_product_reviews_v" USING btree ("version_product_id");
  CREATE INDEX IF NOT EXISTS "_product_reviews_v_version_version_updated_at_idx" ON "_product_reviews_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_product_reviews_v_version_version_created_at_idx" ON "_product_reviews_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_product_reviews_v_version_version__status_idx" ON "_product_reviews_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_product_reviews_v_created_at_idx" ON "_product_reviews_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_product_reviews_v_updated_at_idx" ON "_product_reviews_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_product_reviews_v_latest_idx" ON "_product_reviews_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_hero_module_order_idx" ON "homepage_blocks_hero_module" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_hero_module_parent_id_idx" ON "homepage_blocks_hero_module" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_hero_module_path_idx" ON "homepage_blocks_hero_module" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_hero_module_image_idx" ON "homepage_blocks_hero_module" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_collection_spotlight_order_idx" ON "homepage_blocks_collection_spotlight" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_collection_spotlight_parent_id_idx" ON "homepage_blocks_collection_spotlight" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_collection_spotlight_path_idx" ON "homepage_blocks_collection_spotlight" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_product_row_order_idx" ON "homepage_blocks_product_row" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_product_row_parent_id_idx" ON "homepage_blocks_product_row" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_product_row_path_idx" ON "homepage_blocks_product_row" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_journal_feature_order_idx" ON "homepage_blocks_journal_feature" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_journal_feature_parent_id_idx" ON "homepage_blocks_journal_feature" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_journal_feature_path_idx" ON "homepage_blocks_journal_feature" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_seasonal_banner_order_idx" ON "homepage_blocks_seasonal_banner" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_seasonal_banner_parent_id_idx" ON "homepage_blocks_seasonal_banner" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_seasonal_banner_path_idx" ON "homepage_blocks_seasonal_banner" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "homepage_blocks_seasonal_banner_background_image_idx" ON "homepage_blocks_seasonal_banner" USING btree ("background_image_id");
  CREATE INDEX IF NOT EXISTS "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "homepage_rels_product_collections_id_idx" ON "homepage_rels" USING btree ("product_collections_id");
  CREATE INDEX IF NOT EXISTS "homepage_rels_products_id_idx" ON "homepage_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "homepage_rels_posts_id_idx" ON "homepage_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "products_specs_specs_dimension_diagram_idx" ON "products" USING btree ("specs_dimension_diagram_id");
  CREATE INDEX IF NOT EXISTS "products_video_poster_idx" ON "products" USING btree ("video_poster_id");
  CREATE INDEX IF NOT EXISTS "_products_v_version_specs_version_specs_dimension_diagra_idx" ON "_products_v" USING btree ("version_specs_dimension_diagram_id");
  CREATE INDEX IF NOT EXISTS "_products_v_version_version_video_poster_idx" ON "_products_v" USING btree ("version_video_poster_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_product_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("product_reviews_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_product_reviews_fk";
  ALTER TABLE "_products_v" DROP CONSTRAINT IF EXISTS "_products_v_version_video_poster_id_media_id_fk";
  ALTER TABLE "_products_v" DROP CONSTRAINT IF EXISTS "_products_v_version_specs_dimension_diagram_id_media_id_fk";
  ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_video_poster_id_media_id_fk";
  ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_specs_dimension_diagram_id_media_id_fk";
  ALTER TABLE "homepage_rels" DROP CONSTRAINT IF EXISTS "homepage_rels_posts_fk";
  ALTER TABLE "homepage_rels" DROP CONSTRAINT IF EXISTS "homepage_rels_products_fk";
  ALTER TABLE "homepage_rels" DROP CONSTRAINT IF EXISTS "homepage_rels_product_collections_fk";
  ALTER TABLE "homepage_rels" DROP CONSTRAINT IF EXISTS "homepage_rels_parent_fk";
  ALTER TABLE "homepage_blocks_seasonal_banner" DROP CONSTRAINT IF EXISTS "homepage_blocks_seasonal_banner_parent_id_fk";
  ALTER TABLE "homepage_blocks_seasonal_banner" DROP CONSTRAINT IF EXISTS "homepage_blocks_seasonal_banner_background_image_id_media_id_fk";
  ALTER TABLE "homepage_blocks_journal_feature" DROP CONSTRAINT IF EXISTS "homepage_blocks_journal_feature_parent_id_fk";
  ALTER TABLE "homepage_blocks_product_row" DROP CONSTRAINT IF EXISTS "homepage_blocks_product_row_parent_id_fk";
  ALTER TABLE "homepage_blocks_collection_spotlight" DROP CONSTRAINT IF EXISTS "homepage_blocks_collection_spotlight_parent_id_fk";
  ALTER TABLE "homepage_blocks_hero_module" DROP CONSTRAINT IF EXISTS "homepage_blocks_hero_module_parent_id_fk";
  ALTER TABLE "homepage_blocks_hero_module" DROP CONSTRAINT IF EXISTS "homepage_blocks_hero_module_image_id_media_id_fk";
  ALTER TABLE "_pages_v_blocks_faq" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_faq_parent_id_fk";
  ALTER TABLE "_pages_v_blocks_faq_items" DROP CONSTRAINT IF EXISTS "_pages_v_blocks_faq_items_parent_id_fk";
  ALTER TABLE "pages_blocks_faq" DROP CONSTRAINT IF EXISTS "pages_blocks_faq_parent_id_fk";
  ALTER TABLE "pages_blocks_faq_items" DROP CONSTRAINT IF EXISTS "pages_blocks_faq_items_parent_id_fk";
  ALTER TABLE "_product_reviews_v" DROP CONSTRAINT IF EXISTS "_product_reviews_v_version_product_id_products_id_fk";
  ALTER TABLE "_product_reviews_v" DROP CONSTRAINT IF EXISTS "_product_reviews_v_parent_id_product_reviews_id_fk";
  ALTER TABLE "product_reviews" DROP CONSTRAINT IF EXISTS "product_reviews_product_id_products_id_fk";

  DROP INDEX IF EXISTS "payload_locked_documents_rels_product_reviews_id_idx";
  DROP INDEX IF EXISTS "_products_v_version_version_video_poster_idx";
  DROP INDEX IF EXISTS "_products_v_version_specs_version_specs_dimension_diagra_idx";
  DROP INDEX IF EXISTS "products_video_poster_idx";
  DROP INDEX IF EXISTS "products_specs_specs_dimension_diagram_idx";
  DROP INDEX IF EXISTS "homepage_rels_posts_id_idx";
  DROP INDEX IF EXISTS "homepage_rels_products_id_idx";
  DROP INDEX IF EXISTS "homepage_rels_product_collections_id_idx";
  DROP INDEX IF EXISTS "homepage_rels_path_idx";
  DROP INDEX IF EXISTS "homepage_rels_parent_idx";
  DROP INDEX IF EXISTS "homepage_rels_order_idx";
  DROP INDEX IF EXISTS "homepage_blocks_seasonal_banner_background_image_idx";
  DROP INDEX IF EXISTS "homepage_blocks_seasonal_banner_path_idx";
  DROP INDEX IF EXISTS "homepage_blocks_seasonal_banner_parent_id_idx";
  DROP INDEX IF EXISTS "homepage_blocks_seasonal_banner_order_idx";
  DROP INDEX IF EXISTS "homepage_blocks_journal_feature_path_idx";
  DROP INDEX IF EXISTS "homepage_blocks_journal_feature_parent_id_idx";
  DROP INDEX IF EXISTS "homepage_blocks_journal_feature_order_idx";
  DROP INDEX IF EXISTS "homepage_blocks_product_row_path_idx";
  DROP INDEX IF EXISTS "homepage_blocks_product_row_parent_id_idx";
  DROP INDEX IF EXISTS "homepage_blocks_product_row_order_idx";
  DROP INDEX IF EXISTS "homepage_blocks_collection_spotlight_path_idx";
  DROP INDEX IF EXISTS "homepage_blocks_collection_spotlight_parent_id_idx";
  DROP INDEX IF EXISTS "homepage_blocks_collection_spotlight_order_idx";
  DROP INDEX IF EXISTS "homepage_blocks_hero_module_image_idx";
  DROP INDEX IF EXISTS "homepage_blocks_hero_module_path_idx";
  DROP INDEX IF EXISTS "homepage_blocks_hero_module_parent_id_idx";
  DROP INDEX IF EXISTS "homepage_blocks_hero_module_order_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_faq_path_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_faq_parent_id_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_faq_order_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_faq_items_parent_id_idx";
  DROP INDEX IF EXISTS "_pages_v_blocks_faq_items_order_idx";
  DROP INDEX IF EXISTS "pages_blocks_faq_path_idx";
  DROP INDEX IF EXISTS "pages_blocks_faq_parent_id_idx";
  DROP INDEX IF EXISTS "pages_blocks_faq_order_idx";
  DROP INDEX IF EXISTS "pages_blocks_faq_items_parent_id_idx";
  DROP INDEX IF EXISTS "pages_blocks_faq_items_order_idx";
  DROP INDEX IF EXISTS "_product_reviews_v_latest_idx";
  DROP INDEX IF EXISTS "_product_reviews_v_updated_at_idx";
  DROP INDEX IF EXISTS "_product_reviews_v_created_at_idx";
  DROP INDEX IF EXISTS "_product_reviews_v_version_version__status_idx";
  DROP INDEX IF EXISTS "_product_reviews_v_version_version_created_at_idx";
  DROP INDEX IF EXISTS "_product_reviews_v_version_version_updated_at_idx";
  DROP INDEX IF EXISTS "_product_reviews_v_version_version_product_idx";
  DROP INDEX IF EXISTS "_product_reviews_v_parent_idx";
  DROP INDEX IF EXISTS "product_reviews__status_idx";
  DROP INDEX IF EXISTS "product_reviews_created_at_idx";
  DROP INDEX IF EXISTS "product_reviews_updated_at_idx";
  DROP INDEX IF EXISTS "product_reviews_product_idx";

  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "product_reviews_id";

  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_video_poster_id";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_dimension_diagram_id";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_face_shape_hints";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_fit_notes";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_frame_material";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_lens_treatment";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_lens_material";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_lens_type";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_lens_height_mm";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_lens_width_mm";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_temple_mm";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_bridge_mm";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_specs_show_specs_on_pdp";
  ALTER TABLE "_products_v" DROP COLUMN IF EXISTS "version_video_url";

  ALTER TABLE "products" DROP COLUMN IF EXISTS "video_poster_id";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "video_url";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_dimension_diagram_id";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_face_shape_hints";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_fit_notes";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_frame_material";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_lens_treatment";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_lens_material";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_lens_type";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_lens_height_mm";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_lens_width_mm";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_temple_mm";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_bridge_mm";
  ALTER TABLE "products" DROP COLUMN IF EXISTS "specs_show_specs_on_pdp";

  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_primary_cta_label";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_booking_phone";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_booking_url";
  ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_service_type";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "primary_cta_label";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "booking_phone";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "booking_url";
  ALTER TABLE "services" DROP COLUMN IF EXISTS "service_type";

  ALTER TABLE "_stores_v" DROP COLUMN IF EXISTS "version_region";
  ALTER TABLE "stores" DROP COLUMN IF EXISTS "region";

  DROP TABLE IF EXISTS "homepage_rels" CASCADE;
  DROP TABLE IF EXISTS "homepage_blocks_seasonal_banner" CASCADE;
  DROP TABLE IF EXISTS "homepage_blocks_journal_feature" CASCADE;
  DROP TABLE IF EXISTS "homepage_blocks_product_row" CASCADE;
  DROP TABLE IF EXISTS "homepage_blocks_collection_spotlight" CASCADE;
  DROP TABLE IF EXISTS "homepage_blocks_hero_module" CASCADE;
  DROP TABLE IF EXISTS "homepage" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_faq" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_faq_items" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_faq" CASCADE;
  DROP TABLE IF EXISTS "_product_reviews_v" CASCADE;
  DROP TABLE IF EXISTS "product_reviews" CASCADE;

  DO $$ BEGIN DROP TYPE "public"."enum__services_v_version_service_type";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_services_service_type";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__product_reviews_v_version_status";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_product_reviews_status";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__products_v_version_specs_frame_material";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__products_v_version_specs_lens_treatment";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__products_v_version_specs_lens_material";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum__products_v_version_specs_lens_type";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_specs_frame_material";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_specs_lens_treatment";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_specs_lens_material";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_specs_lens_type";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  `)
}
