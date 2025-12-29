-- AlterTable
ALTER TABLE "StoreLocation" ALTER COLUMN "province" DROP DEFAULT;

-- CreateTable
CREATE TABLE "PromotionalPage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleTranslations" JSONB,
    "description" TEXT NOT NULL,
    "descriptionTranslations" JSONB,
    "imageUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotionalPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromotionalPage_isActive_idx" ON "PromotionalPage"("isActive");

-- CreateIndex
CREATE INDEX "PromotionalPage_displayOrder_idx" ON "PromotionalPage"("displayOrder");
