"use server";

import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

//獲取MembershipCard信息
export async function getMembershipCardInfo(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatarId: true,
        phoneNumber: true,
        phoneNumberVerified: true,
        currentEcocoPoints: true,
        currentEcocoCoins: true,
        totalPETCount: true,
        totalHDPECount: true,
        totalPPCount: true,
        totalAluminumCanCount: true,
        totalBatteryCount: true,
        lastRecycleAt: true,
        lastLoginAt: true,
      },
    });
    return { success: true, user };
  } catch (error) {
    console.error("獲取會員卡信息錯誤:", error);
    return { success: false, error: "獲取會員卡信息失敗" };
  }
}

// 獲取用戶信息
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatar: true,
        UserOwnedAvatar: {
          include: {
            avatar: true,
          },
        },
      },
    });

    if (!user) {
      return { success: true, user: null };
    }

    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("獲取用戶信息錯誤:", error);
    return { success: false, error: "獲取用戶信息失敗" };
  }
}

// 更新使用者資料，不更新密碼，更新後回傳新使用者資料
export async function updateUser(userId: string, data: Prisma.UserUpdateInput) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("更新用戶資料庫錯誤:", error);
    return { success: false, error: "更新用戶資料失敗" };
  }
}

// 通過手機號碼獲取用戶，不包含密碼
export async function isPhoneNumberRegistered(phoneNumber: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
      select: {
        id: true,
      },
    });
    return { success: true, isRegistered: !!user, id: user?.id };
  } catch (error) {
    console.error("檢查手機號碼是否已註冊錯誤:", error);
    return { success: false, error: "檢查手機號碼是否已註冊失敗" };
  }
}

// 通過手機號碼獲取用戶，包含密碼，僅供身份驗證使用
export async function getUserByPhoneWithPassword(phoneNumber: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
      select: {
        id: true,
        name: true,
        password: true,
        phoneNumber: true,
        phoneNumberVerified: true,
        avatarId: true,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("獲取用戶信息錯誤:", error);
    return { success: false, error: "獲取用戶信息失敗" };
  }
}

// 通過 ID 獲取用戶，包含密碼，僅供身份驗證使用
export async function getUserByIdWithPassword(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    return { success: true, user };
  } catch (error) {
    console.error("獲取用戶信息錯誤:", error);
    return { success: false, error: "獲取用戶信息失敗" };
  }
}
