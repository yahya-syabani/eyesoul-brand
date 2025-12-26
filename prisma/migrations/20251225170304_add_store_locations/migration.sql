-- CreateTable
CREATE TABLE "StoreLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "hoursWeekdays" TEXT NOT NULL,
    "hoursSaturday" TEXT NOT NULL,
    "hoursSunday" TEXT NOT NULL,
    "mapUrl" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoreLocation_isActive_idx" ON "StoreLocation"("isActive");

-- CreateIndex
CREATE INDEX "StoreLocation_displayOrder_idx" ON "StoreLocation"("displayOrder");
