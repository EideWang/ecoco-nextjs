"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

// 收藏站點
export const toggleFavoriteStation = async (stationId: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        error: "未授權的操作",
      };
    }

    const userId = session.user.id;

    const existingFavorite = await prisma.userFavoriteStation.findUnique({
      where: {
        userId_stationId: {
          userId,
          stationId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.userFavoriteStation.delete({
        where: {
          userId_stationId: {
            userId,
            stationId,
          },
        },
      });
    } else {
      await prisma.userFavoriteStation.create({
        data: {
          userId,
          stationId,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/station");
    revalidatePath(`/station/${stationId}`);
    revalidatePath("/profile/favorite-stations");

    return { success: true };
  } catch (error) {
    return {
      error: "伺服器發生錯誤，請稍後再試",
    };
  }
};
