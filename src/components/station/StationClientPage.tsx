"use client";

import {
  useState,
  useEffect,
  useRef,
  useTransition,
  useOptimistic,
  useMemo,
} from "react";
import { Container, Typography, Box, Snackbar, Alert } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import StationCard from "@/components/station/StationCard";
import { Station, PlasticType } from "@/types/station";
import StationFilter from "@/components/station/StationFilter";
import { useUserLocation } from "@/hooks/useUserLocation";
import { calculateStationDistance } from "@/lib/utils/calculateStationDistance";
import { toggleFavoriteStation } from "@/actions/station-actions";

const plasticTypes: PlasticType[] = ["PET", "HDPE", "PP"];

function isPlasticType(category: string): category is PlasticType {
  return plasticTypes.includes(category as PlasticType);
}

interface StationClientPageProps {
  initialStations: Station[];
  initialFavoriteIds: string[];
}

export default function StationClientPage({
  initialStations,
  initialFavoriteIds,
}: StationClientPageProps) {
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useUserLocation();
  const [isTransitioning, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const cityOptions = Array.from(new Set(initialStations.map(s => s.city)));
  const districtMap = cityOptions.reduce(
    (acc, city) => {
      acc[city] = Array.from(
        new Set(
          initialStations.filter(s => s.city === city).map(s => s.district)
        )
      );
      return acc;
    },
    {} as Record<string, string[]>
  );

  const [filter, setFilter] = useState({
    keyword: "",
    city: "",
    district: "",
    category: "",
  });
  const [showLocationError, setShowLocationError] = useState(false);

  // --- 狀態管理分層 ---

  // 1. 站點狀態：距離計算
  const sortedStations = useMemo(() => {
    if (location) {
      const stationsWithDistance = initialStations.map(station => ({
        ...station,
        distance: calculateStationDistance(
          location.latitude,
          location.longitude,
          station.lat,
          station.lng
        ),
      }));
      stationsWithDistance.sort(
        (a, b) => (a.distance ?? 0) - (b.distance ?? 0)
      );
      return stationsWithDistance;
    }
    return initialStations;
  }, [initialStations, location]);

  // 2. 個人收藏狀態
  const [favoriteIdSet, setFavoriteIdSet] = useState(
    () => new Set(initialFavoriteIds)
  );

  const [optimisticFavoriteSet, setOptimisticFavorite] = useOptimistic(
    favoriteIdSet,
    (currentSet, stationId: string) => {
      const newSet = new Set(currentSet);
      if (newSet.has(stationId)) {
        newSet.delete(stationId);
      } else {
        newSet.add(stationId);
      }
      return newSet;
    }
  );

  // 當 revalidate 導致 initialFavoriteIds prop 變化時，同步本地 Set
  useEffect(() => {
    setFavoriteIdSet(new Set(initialFavoriteIds));
  }, [initialFavoriteIds]);

  // 当 transition 结束后，清除 pendingId
  useEffect(() => {
    if (!isTransitioning) {
      setPendingId(null);
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (locationError) {
      //可考慮插一個紀錄使用者拒絕授權的比例
      setShowLocationError(true);
    }
  }, [locationError]);

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
  };

  const handleToggleFavorite = async (stationId: string) => {
    setPendingId(stationId);
    startTransition(() => {
      setOptimisticFavorite(stationId);
      toggleFavoriteStation(stationId);
    });
  };

  const handleCloseLocationError = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setShowLocationError(false);
  };

  const parentRef = useRef<HTMLDivElement>(null);

  // 3. render組合層
  const filteredStations = sortedStations.filter(s => {
    if (filter.keyword && !s.name.includes(filter.keyword)) return false;
    if (filter.city && s.city !== filter.city) return false;
    if (filter.district && s.district !== filter.district) return false;
    if (filter.category) {
      if (filter.category === "ALU" && (!s.items.alu || !s.items.alu.enabled))
        return false;
      if (
        filter.category === "BATTERY" &&
        (!s.items.battery || !s.items.battery.enabled)
      )
        return false;
      if (isPlasticType(filter.category)) {
        if (
          !s.items.plastics ||
          !s.items.plastics.enabled ||
          !s.items.plastics.types.includes(filter.category)
        )
          return false;
      }
    }
    return true;
  });

  const rowVirtualizer = useVirtualizer({
    count: filteredStations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 190,
    overscan: 5,
    gap: 0,
  });

  return (
    <Container sx={{ p: 0 }}>
      <StationFilter
        cityOptions={cityOptions}
        districtMap={districtMap}
        onFilterChange={handleFilterChange}
      />
      <Box
        ref={parentRef}
        sx={{
          height: { xs: "calc(100vh - 164px)", sm: "calc(100vh - 172px)" },
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {locationLoading ? (
            <Typography>...</Typography>
          ) : (
            rowVirtualizer.getVirtualItems().map(virtualItem => {
              const station = filteredStations[virtualItem.index];
              if (!station) return null;

              const isFavorite = optimisticFavoriteSet.has(station.id);

              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualItem.index}
                >
                  <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, pb: 1.5 }}>
                    <StationCard
                      {...station}
                      isFavorite={isFavorite}
                      onToggleFavorite={handleToggleFavorite}
                      isPending={pendingId === station.id}
                    />
                  </Box>
                </div>
              );
            })
          )}
        </div>
      </Box>
      <Snackbar
        open={showLocationError}
        autoHideDuration={3000}
        onClose={handleCloseLocationError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: { xs: 64, sm: 72 } }}
      >
        <Alert
          onClose={handleCloseLocationError}
          severity="info"
          variant="filled"
          sx={{ width: "80%" }}
        >
          無法取得您的位置，站點將以預設順序顯示。
        </Alert>
      </Snackbar>
    </Container>
  );
}
