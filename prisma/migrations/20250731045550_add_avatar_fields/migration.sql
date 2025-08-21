/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "image",
ADD COLUMN     "avatarId" TEXT,
ADD COLUMN     "currentEcocoCoins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentEcocoPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "lastRecycleAt" TIMESTAMP(3),
ADD COLUMN     "totalAluminumCanCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalBatteryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalHDPECount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPETCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPPCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."Avatar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "pointsCost" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserOwnedAvatar" (
    "userId" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOwnedAvatar_pkey" PRIMARY KEY ("userId","avatarId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_name_key" ON "public"."Avatar"("name");

-- CreateIndex
CREATE INDEX "UserOwnedAvatar_userId_idx" ON "public"."UserOwnedAvatar"("userId");

-- CreateIndex
CREATE INDEX "UserOwnedAvatar_avatarId_idx" ON "public"."UserOwnedAvatar"("avatarId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."Avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserOwnedAvatar" ADD CONSTRAINT "UserOwnedAvatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserOwnedAvatar" ADD CONSTRAINT "UserOwnedAvatar_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
