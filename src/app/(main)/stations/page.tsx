import { Suspense } from "react";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import StationClientPage from "@/components/station/StationClientPage";
import { Station } from "@/types/station";

export default async function StationsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // 1. 获取所有站点数据
  const allStationsData = await prisma.station.findMany({
    where: {
      showOnWeb: true,
    },
    include: {
      recyclableItems: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  // 2. 如果用户已登录，获取其收藏列表的 ID
  let favoriteStationIds: string[] = [];
  if (userId) {
    const userFavorites = await prisma.userFavoriteStation.findMany({
      where: {
        userId: userId,
      },
      select: {
        stationId: true,
      },
    });
    favoriteStationIds = userFavorites.map(fav => fav.stationId);
  }

  // 将 recyclableItems 数组处理成 StationCard 需要的 items 对象格式
  const allStations = allStationsData.map(station => {
    const items = station.recyclableItems.reduce(
      (acc, item) => {
        const category = item.itemType.toLowerCase();
        if (category === "plastics") {
          acc.plastics = {
            enabled: item.enabled,
            types: item.plasticTypes as ["PET", "HDPE", "PP"],
            remaining: item.remaining,
          };
        } else if (category === "alu" || category === "battery") {
          acc[category] = {
            enabled: item.enabled,
            remaining: item.remaining,
          };
        }
        return acc;
      },
      {} as Station["items"]
    );
    return { ...station, items };
  });

  return (
    <Suspense fallback={<div>Loading stations...</div>}>
      <StationClientPage
        initialStations={allStations}
        initialFavoriteIds={favoriteStationIds}
      />
    </Suspense>
  );
}
