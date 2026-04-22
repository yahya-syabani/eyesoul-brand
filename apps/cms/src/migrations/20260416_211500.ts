import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Align products version columns with contact lens ranges.
 * Prevents dev-mode schema push prompts during `payload run` / seeding.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "_products_v"
    ADD COLUMN IF NOT EXISTS "version_contact_lens_cylinder_power_range_min" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_cylinder_power_range_max" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_cylinder_power_range_step" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_axis_step" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_add_power_range_min" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_add_power_range_max" numeric,
    ADD COLUMN IF NOT EXISTS "version_contact_lens_add_power_range_step" numeric;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "_products_v"
    DROP COLUMN IF EXISTS "version_contact_lens_add_power_range_step",
    DROP COLUMN IF EXISTS "version_contact_lens_add_power_range_max",
    DROP COLUMN IF EXISTS "version_contact_lens_add_power_range_min",
    DROP COLUMN IF EXISTS "version_contact_lens_axis_step",
    DROP COLUMN IF EXISTS "version_contact_lens_cylinder_power_range_step",
    DROP COLUMN IF EXISTS "version_contact_lens_cylinder_power_range_max",
    DROP COLUMN IF EXISTS "version_contact_lens_cylinder_power_range_min";
  `)
}

