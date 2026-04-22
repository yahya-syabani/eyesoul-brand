import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Product taxonomy + variants (Phase 1).
 * - Adds productType + facet columns to products
 * - Adds product-variants collection tables
 *
 * Note: some fields are stored as VARCHAR/JSONB to keep migrations simple
 * and avoid large join-table expansions in Phase 1 (catalog-only).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_products_product_type" AS ENUM('optical-frame','sunglasses','contact-soft','contact-care','accessory');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum__products_v_version_product_type" AS ENUM('optical-frame','sunglasses','contact-soft','contact-care','accessory');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  ALTER TABLE "products"
    ADD COLUMN IF NOT EXISTS "product_type" "enum_products_product_type" DEFAULT 'optical-frame' NOT NULL,
    ADD COLUMN IF NOT EXISTS "brand" varchar,
    ADD COLUMN IF NOT EXISTS "gtin" varchar,
    ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "badges" jsonb;

  -- Frame / sunglasses facets
  ALTER TABLE "products"
    ADD COLUMN IF NOT EXISTS "frame_frame_shape" varchar,
    ADD COLUMN IF NOT EXISTS "frame_rim_type" varchar,
    ADD COLUMN IF NOT EXISTS "frame_frame_color" varchar,
    ADD COLUMN IF NOT EXISTS "frame_rx_able" boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS "frame_lens_color" varchar,
    ADD COLUMN IF NOT EXISTS "frame_polarized" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "frame_uv400" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "frame_lens_category" numeric;

  -- Soft contact lenses facets
  ALTER TABLE "products"
    ADD COLUMN IF NOT EXISTS "contact_lens_replacement_schedule" varchar,
    ADD COLUMN IF NOT EXISTS "contact_lens_units_per_box" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_base_curve_options_mm" jsonb,
    ADD COLUMN IF NOT EXISTS "contact_lens_diameter_options_mm" jsonb,
    ADD COLUMN IF NOT EXISTS "contact_lens_sphere_power_range_min" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_sphere_power_range_max" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_sphere_power_range_step" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_has_cylinder" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "contact_lens_cylinder_power_range_min" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_cylinder_power_range_max" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_cylinder_power_range_step" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_axis_step" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_has_add" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "contact_lens_add_power_range_min" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_add_power_range_max" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_add_power_range_step" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_material_type" varchar,
    ADD COLUMN IF NOT EXISTS "contact_lens_water_content_percent" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_dk_t" numeric,
    ADD COLUMN IF NOT EXISTS "contact_lens_wearing_modality" varchar;

  -- Care products facets
  ALTER TABLE "products"
    ADD COLUMN IF NOT EXISTS "care_product_unit_of_measure" varchar,
    ADD COLUMN IF NOT EXISTS "care_product_unit_volume_ml" numeric,
    ADD COLUMN IF NOT EXISTS "care_product_units_per_pack" numeric,
    ADD COLUMN IF NOT EXISTS "care_product_compatibility" varchar;

  -- Accessories facets
  ALTER TABLE "products"
    ADD COLUMN IF NOT EXISTS "accessory_accessory_type" varchar,
    ADD COLUMN IF NOT EXISTS "accessory_units_per_pack" numeric,
    ADD COLUMN IF NOT EXISTS "accessory_compatibility_notes" varchar;

  -- Versions table columns (minimal: productType + new facets used by storefront)
  ALTER TABLE "_products_v"
    ADD COLUMN IF NOT EXISTS "version_product_type" "enum__products_v_version_product_type" DEFAULT 'optical-frame',
    ADD COLUMN IF NOT EXISTS "version_brand" varchar,
    ADD COLUMN IF NOT EXISTS "version_gtin" varchar,
    ADD COLUMN IF NOT EXISTS "version_featured" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "version_badges" jsonb,
    ADD COLUMN IF NOT EXISTS "version_frame_frame_shape" varchar,
    ADD COLUMN IF NOT EXISTS "version_frame_rim_type" varchar,
    ADD COLUMN IF NOT EXISTS "version_frame_frame_color" varchar,
    ADD COLUMN IF NOT EXISTS "version_frame_rx_able" boolean DEFAULT true,
    ADD COLUMN IF NOT EXISTS "version_frame_lens_color" varchar,
    ADD COLUMN IF NOT EXISTS "version_frame_polarized" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "version_frame_uv400" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "version_frame_lens_category" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_replacement_schedule" varchar,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_units_per_box" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_base_curve_options_mm" jsonb,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_diameter_options_mm" jsonb,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_sphere_power_range_min" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_sphere_power_range_max" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_sphere_power_range_step" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_has_cylinder" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_has_add" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_material_type" varchar,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_water_content_percent" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_dk_t" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_wearing_modality" varchar,
    ADD COLUMN IF NOT EXISTS "version_care_product_unit_of_measure" varchar,
    ADD COLUMN IF NOT EXISTS "version_care_product_unit_volume_ml" numeric,
    ADD COLUMN IF NOT EXISTS "version_care_product_units_per_pack" numeric,
    ADD COLUMN IF NOT EXISTS "version_care_product_compatibility" varchar,
    ADD COLUMN IF NOT EXISTS "version_accessory_accessory_type" varchar,
    ADD COLUMN IF NOT EXISTS "version_accessory_units_per_pack" numeric,
    ADD COLUMN IF NOT EXISTS "version_accessory_compatibility_notes" varchar;

  -- Product variants tables
  DO $$ BEGIN
    CREATE TYPE "public"."enum_product_variants_status" AS ENUM('draft','published');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum__product_variants_v_version_status" AS ENUM('draft','published');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  CREATE TABLE IF NOT EXISTS "product_variants" (
    "id" serial PRIMARY KEY NOT NULL,
    "product_id" integer NOT NULL,
    "title" varchar NOT NULL,
    "sku" varchar,
    "gtin" varchar,
    "attributes_color_name" varchar,
    "attributes_color_code" varchar,
    "attributes_lens_width_mm" numeric,
    "attributes_bridge_mm" numeric,
    "attributes_temple_mm" numeric,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_product_variants_status" DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS "product_variants_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  CREATE TABLE IF NOT EXISTS "_product_variants_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_product_id" integer,
    "version_title" varchar,
    "version_sku" varchar,
    "version_gtin" varchar,
    "version_attributes_color_name" varchar,
    "version_attributes_color_code" varchar,
    "version_attributes_lens_width_mm" numeric,
    "version_attributes_bridge_mm" numeric,
    "version_attributes_temple_mm" numeric,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__product_variants_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );

  CREATE TABLE IF NOT EXISTS "_product_variants_v_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  DO $$ BEGIN
    ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk"
      FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    ALTER TABLE "product_variants_rels" ADD CONSTRAINT "product_variants_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    ALTER TABLE "product_variants_rels" ADD CONSTRAINT "product_variants_rels_media_fk"
      FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    ALTER TABLE "_product_variants_v" ADD CONSTRAINT "_product_variants_v_parent_id_product_variants_id_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    ALTER TABLE "_product_variants_v" ADD CONSTRAINT "_product_variants_v_version_product_id_products_id_fk"
      FOREIGN KEY ("version_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    ALTER TABLE "_product_variants_v_rels" ADD CONSTRAINT "_product_variants_v_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."_product_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  DO $$ BEGIN
    ALTER TABLE "_product_variants_v_rels" ADD CONSTRAINT "_product_variants_v_rels_media_fk"
      FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  CREATE INDEX IF NOT EXISTS "products_product_type_idx" ON "products" USING btree ("product_type");
  CREATE INDEX IF NOT EXISTS "products_featured_idx" ON "products" USING btree ("featured");
  CREATE INDEX IF NOT EXISTS "product_variants_product_idx" ON "product_variants" USING btree ("product_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "product_variants_sku_idx" ON "product_variants" USING btree ("sku");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX IF EXISTS "product_variants_sku_idx";
  DROP INDEX IF EXISTS "product_variants_product_idx";
  DROP INDEX IF EXISTS "products_featured_idx";
  DROP INDEX IF EXISTS "products_product_type_idx";

  DROP TABLE IF EXISTS "_product_variants_v_rels" CASCADE;
  DROP TABLE IF EXISTS "_product_variants_v" CASCADE;
  DROP TABLE IF EXISTS "product_variants_rels" CASCADE;
  DROP TABLE IF EXISTS "product_variants" CASCADE;

  ALTER TABLE "_products_v"
    DROP COLUMN IF EXISTS "version_accessory_compatibility_notes",
    DROP COLUMN IF EXISTS "version_accessory_units_per_pack",
    DROP COLUMN IF EXISTS "version_accessory_accessory_type",
    DROP COLUMN IF EXISTS "version_care_product_compatibility",
    DROP COLUMN IF EXISTS "version_care_product_units_per_pack",
    DROP COLUMN IF EXISTS "version_care_product_unit_volume_ml",
    DROP COLUMN IF EXISTS "version_care_product_unit_of_measure",
    DROP COLUMN IF EXISTS "version_contact_lens_wearing_modality",
    DROP COLUMN IF EXISTS "version_contact_lens_dk_t",
    DROP COLUMN IF EXISTS "version_contact_lens_water_content_percent",
    DROP COLUMN IF EXISTS "version_contact_lens_material_type",
    DROP COLUMN IF EXISTS "version_contact_lens_has_add",
    DROP COLUMN IF EXISTS "version_contact_lens_has_cylinder",
    DROP COLUMN IF EXISTS "version_contact_lens_sphere_power_range_step",
    DROP COLUMN IF EXISTS "version_contact_lens_sphere_power_range_max",
    DROP COLUMN IF EXISTS "version_contact_lens_sphere_power_range_min",
    DROP COLUMN IF EXISTS "version_contact_lens_diameter_options_mm",
    DROP COLUMN IF EXISTS "version_contact_lens_base_curve_options_mm",
    DROP COLUMN IF EXISTS "version_contact_lens_units_per_box",
    DROP COLUMN IF EXISTS "version_contact_lens_replacement_schedule",
    DROP COLUMN IF EXISTS "version_frame_lens_category",
    DROP COLUMN IF EXISTS "version_frame_uv400",
    DROP COLUMN IF EXISTS "version_frame_polarized",
    DROP COLUMN IF EXISTS "version_frame_lens_color",
    DROP COLUMN IF EXISTS "version_frame_rx_able",
    DROP COLUMN IF EXISTS "version_frame_frame_color",
    DROP COLUMN IF EXISTS "version_frame_rim_type",
    DROP COLUMN IF EXISTS "version_frame_frame_shape",
    DROP COLUMN IF EXISTS "version_badges",
    DROP COLUMN IF EXISTS "version_featured",
    DROP COLUMN IF EXISTS "version_gtin",
    DROP COLUMN IF EXISTS "version_brand",
    DROP COLUMN IF EXISTS "version_product_type";

  ALTER TABLE "products"
    DROP COLUMN IF EXISTS "accessory_compatibility_notes",
    DROP COLUMN IF EXISTS "accessory_units_per_pack",
    DROP COLUMN IF EXISTS "accessory_accessory_type",
    DROP COLUMN IF EXISTS "care_product_compatibility",
    DROP COLUMN IF EXISTS "care_product_units_per_pack",
    DROP COLUMN IF EXISTS "care_product_unit_volume_ml",
    DROP COLUMN IF EXISTS "care_product_unit_of_measure",
    DROP COLUMN IF EXISTS "contact_lens_wearing_modality",
    DROP COLUMN IF EXISTS "contact_lens_dk_t",
    DROP COLUMN IF EXISTS "contact_lens_water_content_percent",
    DROP COLUMN IF EXISTS "contact_lens_material_type",
    DROP COLUMN IF EXISTS "contact_lens_add_power_range_step",
    DROP COLUMN IF EXISTS "contact_lens_add_power_range_max",
    DROP COLUMN IF EXISTS "contact_lens_add_power_range_min",
    DROP COLUMN IF EXISTS "contact_lens_has_add",
    DROP COLUMN IF EXISTS "contact_lens_axis_step",
    DROP COLUMN IF EXISTS "contact_lens_cylinder_power_range_step",
    DROP COLUMN IF EXISTS "contact_lens_cylinder_power_range_max",
    DROP COLUMN IF EXISTS "contact_lens_cylinder_power_range_min",
    DROP COLUMN IF EXISTS "contact_lens_has_cylinder",
    DROP COLUMN IF EXISTS "contact_lens_sphere_power_range_step",
    DROP COLUMN IF EXISTS "contact_lens_sphere_power_range_max",
    DROP COLUMN IF EXISTS "contact_lens_sphere_power_range_min",
    DROP COLUMN IF EXISTS "contact_lens_diameter_options_mm",
    DROP COLUMN IF EXISTS "contact_lens_base_curve_options_mm",
    DROP COLUMN IF EXISTS "contact_lens_units_per_box",
    DROP COLUMN IF EXISTS "contact_lens_replacement_schedule",
    DROP COLUMN IF EXISTS "frame_lens_category",
    DROP COLUMN IF EXISTS "frame_uv400",
    DROP COLUMN IF EXISTS "frame_polarized",
    DROP COLUMN IF EXISTS "frame_lens_color",
    DROP COLUMN IF EXISTS "frame_rx_able",
    DROP COLUMN IF EXISTS "frame_frame_color",
    DROP COLUMN IF EXISTS "frame_rim_type",
    DROP COLUMN IF EXISTS "frame_frame_shape",
    DROP COLUMN IF EXISTS "badges",
    DROP COLUMN IF EXISTS "featured",
    DROP COLUMN IF EXISTS "gtin",
    DROP COLUMN IF EXISTS "brand",
    DROP COLUMN IF EXISTS "product_type";

  DO $$ BEGIN DROP TYPE "public"."enum__product_variants_v_version_status";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_product_variants_status";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;

  DO $$ BEGIN DROP TYPE "public"."enum__products_v_version_product_type";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  DO $$ BEGIN DROP TYPE "public"."enum_products_product_type";
  EXCEPTION WHEN undefined_object THEN NULL; END $$;
  `)
}

