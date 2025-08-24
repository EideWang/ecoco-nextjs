"use client";

import {
  useState,
  useTransition,
  useOptimistic,
  useEffect,
  useMemo,
} from "react";
import { Box, Typography } from "@mui/material";
import StationCard, {
  StationCardProps as StationCardData,
} from "@/components/station/StationCard";
import { toggleFavoriteStation } from "@/actions/station-actions";
import { Station as PrismaStation, RecyclableItem } from "@prisma/client";
import { PlasticType } from "@/types/station";

type StationWithRecyclableItems = PrismaStation & {
  recyclableItems: RecyclableItem[];
};

interface FavoriteStationsClientPageProps {
  initialStations: StationWithRecyclableItems[];
}

export default function FavoriteStationsClientPage({
  initialStations,
}: FavoriteStationsClientPageProps) {
  const [isTransitioning, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  // 當 revalidate 觸發 props 更新時，這個 useMemo 會確保列表同步
  const stations = useMemo(() => initialStations, [initialStations]);

  const [optimisticStations, setOptimisticStations] = useOptimistic(
    stations,
    (state, stationId: string) => {
      return state.filter(s => s.id !== stationId);
    }
  );

  useEffect(() => {
    if (!isTransitioning) {
      setPendingId(null);
    }
  }, [isTransitioning]);

  const handleToggleFavorite = (stationId: string) => {
    setPendingId(stationId);
    startTransition(() => {
      setOptimisticStations(stationId);
      toggleFavoriteStation(stationId);
    });
  };

  if (optimisticStations.length === 0) {
    return (
      <Typography variant="body2" sx={{ textAlign: "center", my: 2 }}>
        您尚未將任何站點加入收藏。
      </Typography>
    );
  }

  return (
    <>
      {optimisticStations.map(station => {
        const items = station.recyclableItems.reduce(
          (acc, item) => {
            const category = item.itemType.toLowerCase();
            if (category === "plastics") {
              acc.plastics = {
                enabled: item.enabled,
                types: item.plasticTypes as PlasticType[],
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
          {} as StationCardData["items"]
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
              onToggleFavorite={handleToggleFavorite}
              isPending={pendingId === station.id}
            />
          </Box>
        );
      })}
    </>
  );
}
