import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Container } from "@mui/material";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import FavoriteStationsClientPage from "@/components/station/FavoriteStationsClientPage";

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
      <FavoriteStationsClientPage initialStations={favoriteStations} />
    </Container>
  );
};

export default FavoriteStationsPage;
