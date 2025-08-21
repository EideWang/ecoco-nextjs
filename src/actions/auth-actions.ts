"use server";

import { prisma } from "@/lib/db/prisma";
import { hash, compare } from "bcryptjs";
import { revalidatePath } from "next/cache";
import {
  isPhoneNumberRegistered,
  getUserByIdWithPassword,
  updateUser,
} from "@/lib/db/user";

// 手機號碼註冊
export async function registerWithPhone(
  phoneNumber: string,
  password: string,
  name?: string
) {
  try {
    // 檢查手機號碼是否已存在
    const existingUserResult = await isPhoneNumberRegistered(phoneNumber);

    if (!existingUserResult.success) {
      return { success: false, error: existingUserResult.error };
    }

    if (existingUserResult.isRegistered) {
      return { success: false, error: "此手機號碼已被註冊" };
    }

    // 雜湊密碼
    const hashedPassword = await hash(password, 12);

    // 創建用戶
    const newUser = await prisma.user.create({
      data: {
        phoneNumber,
        password: hashedPassword,
        name: name || `可可粉${phoneNumber.slice(-4)}`, // 如果沒有提供姓名，使用手機號碼後4位
        phoneNumberVerified: new Date(), // 手機號碼註冊視為已驗證
      },
    });

    // 設定預設頭像
    const defaultAvatar = await prisma.avatar.findFirst({
      where: { isDefault: true },
    });

    if (defaultAvatar) {
      await prisma.user.update({
        where: { id: newUser.id },
        data: { avatarId: defaultAvatar.id },
      });

      await prisma.userOwnedAvatar.create({
        data: {
          userId: newUser.id,
          avatarId: defaultAvatar.id,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/profile");
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("註冊錯誤:", error);
    return { success: false, error: "註冊失敗，請稍後再試" };
  }
}

// 更新用戶手機號碼（用於OAuth用戶綁定手機號碼）
export async function updateUserPhoneNumber(
  userId: string,
  phoneNumber: string
) {
  try {
    // 檢查手機號碼是否已被其他用戶使用
    const existingUserResult = await isPhoneNumberRegistered(phoneNumber);

    if (!existingUserResult.success) {
      return { success: false, error: existingUserResult.error };
    }

    if (existingUserResult.isRegistered && existingUserResult.id !== userId) {
      return { success: false, error: "此手機號碼已被其他用戶使用" };
    }

    // 更新用戶手機號碼
    const updatedUserResult = await updateUser(userId, {
      phoneNumber,
      phoneNumberVerified: new Date(),
    });

    if (!updatedUserResult.success) {
      return { success: false, error: updatedUserResult.error };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("更新手機號碼錯誤:", error);
    return { success: false, error: "更新失敗，請稍後再試" };
  }
}

// 更新用戶密碼
export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    // 獲取用戶信息
    const userResult = await getUserByIdWithPassword(userId);

    if (!userResult.success) {
      return { success: false, error: userResult.error };
    }

    const { user } = userResult;

    if (!user || !user.password) {
      return { success: false, error: "用戶不存在或沒有設定密碼" };
    }

    // 驗證當前密碼
    const isValidPassword = await compare(currentPassword, user.password);
    if (!isValidPassword) {
      return { success: false, error: "當前密碼不正確" };
    }

    // 雜湊新密碼
    const hashedNewPassword = await hash(newPassword, 12);

    // 更新密碼
    const updateResult = await updateUser(userId, {
      password: hashedNewPassword,
    });

    if (!updateResult.success) {
      return { success: false, error: updateResult.error };
    }

    return { success: true };
  } catch (error) {
    console.error("更新密碼錯誤:", error);
    return { success: false, error: "更新失敗，請稍後再試" };
  }
}

// 為OAuth用戶設定密碼
export async function setPasswordForOAuthUser(
  userId: string,
  password: string
) {
  try {
    // 檢查用戶是否存在且沒有密碼
    const userResult = await getUserByIdWithPassword(userId);

    if (!userResult.success) {
      return { success: false, error: userResult.error };
    }
    const { user } = userResult;

    if (!user) {
      return { success: false, error: "用戶不存在" };
    }

    if (user.password) {
      return { success: false, error: "用戶已設定密碼" };
    }

    // 雜湊密碼
    const hashedPassword = await hash(password, 12);

    // 更新密碼
    const updateResult = await updateUser(userId, { password: hashedPassword });

    if (!updateResult.success) {
      return { success: false, error: updateResult.error };
    }

    return { success: true };
  } catch (error) {
    console.error("設定密碼錯誤:", error);
    return { success: false, error: "設定失敗，請稍後再試" };
  }
}

// 更新用戶個人資料
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    city?: string;
    district?: string;
    gender?: string;
    dateOfBirth?: Date;
    avatarId?: string;
  }
) {
  try {
    const result = await updateUser(userId, data);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("更新個人資料錯誤:", error);
    return { success: false, error: "更新失敗，請稍後再試" };
  }
}
