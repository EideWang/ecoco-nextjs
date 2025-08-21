import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Box, Typography, Container } from "@mui/material";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import StationCard, {
  StationCardProps,
} from "@/components/station/StationCard";

//先不管Metadata
export const metadata: Metadata = {
  title: "我的收藏站點",
};

const FavoriteStationsPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userWithFavorites = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      favoriteStations: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          station: {
            include: {
              recyclableItems: true,
            },
          },
        },
      },
    },
  });

  const favoriteStations =
    userWithFavorites?.favoriteStations.map(fav => fav.station) || [];

  return (
    <Container sx={{ px: { xs: 2, sm: 4, md: 8 }, py: 2 }}>
      {favoriteStations.length === 0 ? (
        <Typography variant="body2" sx={{ textAlign: "center", my: 2 }}>
          您尚未將任何站點加入收藏。
        </Typography>
      ) : (
        <>
          {favoriteStations.map(station => {
            // 將 recyclableItems 轉換為 StationCard 需要的 items 格式
            const items = station.recyclableItems.reduce(
              (acc, item) => {
                const category = item.itemType.toLowerCase();
                if (category === "plastics") {
                  acc.plastics = {
                    enabled: item.enabled,
                    types: item.plasticTypes as Array<"PET" | "HDPE" | "PP">,
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
              {
                plastics: undefined,
                alu: undefined,
                battery: undefined,
              } as StationCardProps["items"]
            );

            return (
              <Box key={station.id} sx={{ pb: 1.5 }}>
                <StationCard
                  id={station.id}
                  name={station.name}
                  address={station.address}
                  lat={station.lat}
                  lng={station.lng}
                  openHours={station.openHours}
                  items={items}
                  isFavorite={true}
                />
              </Box>
            );
          })}
        </>
      )}
    </Container>
  );
};

export default FavoriteStationsPage;
