/*
  Warnings:

  - Added the required column `province` to the `StoreLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add column as nullable first
ALTER TABLE "StoreLocation" ADD COLUMN IF NOT EXISTS "province" TEXT;

-- Update existing rows to have empty string
UPDATE "StoreLocation" SET "province" = '' WHERE "province" IS NULL;

-- Now make it NOT NULL
ALTER TABLE "StoreLocation" ALTER COLUMN "province" SET NOT NULL;
ALTER TABLE "StoreLocation" ALTER COLUMN "province" SET DEFAULT '';

-- CreateIndex
CREATE INDEX IF NOT EXISTS "StoreLocation_province_idx" ON "StoreLocation"("province");
