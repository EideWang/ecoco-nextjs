"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export const toggleFavoriteStation = async (stationId: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false as const,
        isFavorite: null,
        error: "尚未登入有效的帳號",
      };
    }

    const userId = session.user.id;

    const existingFavorite = await prisma.userFavoriteStation.findUnique({
      where: {
        userId_stationId: { userId, stationId },
      },
    });
    console.log("existingFavorite", existingFavorite);
    if (existingFavorite) {
      await prisma.userFavoriteStation.delete({
        where: { userId_stationId: { userId, stationId } },
      });

      // revalidate 有需要的路徑
      revalidatePath("/station");
      revalidatePath("/profile/favorite-stations");

      return { success: true as const, isFavorite: false, error: null };
    } else {
      await prisma.userFavoriteStation.create({
        data: { userId, stationId },
      });

      revalidatePath("/station");
      revalidatePath("/profile/favorite-stations");

      return { success: true as const, isFavorite: true, error: null };
    }
  } catch (_error) {
    return {
      success: false as const,
      isFavorite: null,
      error: "伺服器發生錯誤，請稍後再試",
    };
  }
};
