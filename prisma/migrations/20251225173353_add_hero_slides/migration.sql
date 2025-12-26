-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "ctaText" TEXT DEFAULT 'Shop Now',
    "ctaLink" TEXT DEFAULT '/shop/breadcrumb-img',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "imageWidth" TEXT,
    "imagePosition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroSlide_isActive_idx" ON "HeroSlide"("isActive");

-- CreateIndex
CREATE INDEX "HeroSlide_displayOrder_idx" ON "HeroSlide"("displayOrder");
