-- CreateEnum
CREATE TYPE "public"."ItemType" AS ENUM ('PLASTICS', 'ALU', 'BATTERY');

-- CreateTable
CREATE TABLE "public"."Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "openHours" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "showOnWeb" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RecyclableItem" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "itemType" "public"."ItemType" NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "remaining" INTEGER NOT NULL,
    "plasticTypes" TEXT[],

    CONSTRAINT "RecyclableItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StationCampaign" (
    "stationId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StationCampaign_pkey" PRIMARY KEY ("stationId","campaignId")
);

-- CreateTable
CREATE TABLE "public"."UserFavoriteStation" (
    "userId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavoriteStation_pkey" PRIMARY KEY ("userId","stationId")
);

-- CreateIndex
CREATE INDEX "RecyclableItem_stationId_idx" ON "public"."RecyclableItem"("stationId");

-- CreateIndex
CREATE INDEX "StationCampaign_stationId_idx" ON "public"."StationCampaign"("stationId");

-- CreateIndex
CREATE INDEX "StationCampaign_campaignId_idx" ON "public"."StationCampaign"("campaignId");

-- CreateIndex
CREATE INDEX "UserFavoriteStation_userId_idx" ON "public"."UserFavoriteStation"("userId");

-- CreateIndex
CREATE INDEX "UserFavoriteStation_stationId_idx" ON "public"."UserFavoriteStation"("stationId");

-- AddForeignKey
ALTER TABLE "public"."RecyclableItem" ADD CONSTRAINT "RecyclableItem_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StationCampaign" ADD CONSTRAINT "StationCampaign_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StationCampaign" ADD CONSTRAINT "StationCampaign_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavoriteStation" ADD CONSTRAINT "UserFavoriteStation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavoriteStation" ADD CONSTRAINT "UserFavoriteStation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
