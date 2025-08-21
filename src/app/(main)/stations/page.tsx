import { getStations } from "@/lib/db/station";
import { Station } from "@/types/station";
import { RecyclableItem } from "@prisma/client";
import StationClientPage from "@/components/station/StationClientPage";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

// 格式化 Prisma 回傳的 recyclableItems
const formatRecyclableItems = (items: RecyclableItem[]) => {
  const formatted: Station["items"] = {};

  items.forEach(item => {
    if (item.itemType === "PLASTICS") {
      formatted.plastics = {
        enabled: item.enabled,
        remaining: item.remaining,
        types: item.plasticTypes as ("PET" | "HDPE" | "PP")[],
      };
    } else if (item.itemType === "ALU") {
      formatted.alu = {
        enabled: item.enabled,
        remaining: item.remaining,
      };
    } else if (item.itemType === "BATTERY") {
      formatted.battery = {
        enabled: item.enabled,
        remaining: item.remaining,
      };
    }
  });

  return formatted;
};

// 這是主要的 Server Component
export default async function StationsPage() {
  const dbStations = await getStations();
  const session = await auth();

  let favoriteStationIds = new Set<string>();

  if (session?.user?.id) {
    const userFavorites = await prisma.userFavoriteStation.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        stationId: true,
      },
    });
    favoriteStationIds = new Set(userFavorites.map(fav => fav.stationId));
  }

  // 將 Prisma 的 Station 模型轉換為前端需要的 Station 類型
  const stations: Station[] = dbStations.map(station => ({
    ...station,
    isFavorite: favoriteStationIds.has(station.id),
    items: formatRecyclableItems(station.recyclableItems),
    // TODO: 這裡的 campaigns 需要從資料庫讀取
    campaignTags: [],
  }));

  return <StationClientPage initialStations={stations} />;
}
