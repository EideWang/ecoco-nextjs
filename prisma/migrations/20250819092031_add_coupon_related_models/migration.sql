-- CreateEnum
CREATE TYPE "public"."CouponRedemptionType" AS ENUM ('VERIFICATION_CODE', 'TIMED_QR_CODE', 'SERIAL_NUMBER', 'BARCODE');

-- CreateEnum
CREATE TYPE "public"."UserCouponStatus" AS ENUM ('UNUSED', 'USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Coupon" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pointsCost" INTEGER,
    "coinsCost" INTEGER,
    "redemptionType" "public"."CouponRedemptionType" NOT NULL,
    "totalQuantity" INTEGER NOT NULL,
    "redeemedQuantity" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "validityDays" INTEGER,
    "termsAndConditions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserCoupon" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "status" "public"."UserCouponStatus" NOT NULL DEFAULT 'UNUSED',
    "serialNumber" TEXT,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "redeemedAt" TIMESTAMP(3),

    CONSTRAINT "UserCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CouponCode" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isAssigned" BOOLEAN NOT NULL DEFAULT false,
    "userCouponId" TEXT,

    CONSTRAINT "CouponCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RedemptionLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storeIdentifier" TEXT,
    "partnerId" TEXT NOT NULL,

    CONSTRAINT "RedemptionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partner_name_key" ON "public"."Partner"("name");

-- CreateIndex
CREATE INDEX "Coupon_partnerId_idx" ON "public"."Coupon"("partnerId");

-- CreateIndex
CREATE INDEX "UserCoupon_userId_idx" ON "public"."UserCoupon"("userId");

-- CreateIndex
CREATE INDEX "UserCoupon_couponId_idx" ON "public"."UserCoupon"("couponId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCoupon_userId_couponId_serialNumber_key" ON "public"."UserCoupon"("userId", "couponId", "serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CouponCode_userCouponId_key" ON "public"."CouponCode"("userCouponId");

-- CreateIndex
CREATE INDEX "CouponCode_couponId_isAssigned_idx" ON "public"."CouponCode"("couponId", "isAssigned");

-- CreateIndex
CREATE UNIQUE INDEX "CouponCode_couponId_code_key" ON "public"."CouponCode"("couponId", "code");

-- CreateIndex
CREATE INDEX "RedemptionLog_userId_idx" ON "public"."RedemptionLog"("userId");

-- CreateIndex
CREATE INDEX "RedemptionLog_couponId_idx" ON "public"."RedemptionLog"("couponId");

-- CreateIndex
CREATE INDEX "RedemptionLog_partnerId_idx" ON "public"."RedemptionLog"("partnerId");

-- AddForeignKey
ALTER TABLE "public"."Coupon" ADD CONSTRAINT "Coupon_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "public"."Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCoupon" ADD CONSTRAINT "UserCoupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCoupon" ADD CONSTRAINT "UserCoupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CouponCode" ADD CONSTRAINT "CouponCode_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CouponCode" ADD CONSTRAINT "CouponCode_userCouponId_fkey" FOREIGN KEY ("userCouponId") REFERENCES "public"."UserCoupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RedemptionLog" ADD CONSTRAINT "RedemptionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RedemptionLog" ADD CONSTRAINT "RedemptionLog_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
