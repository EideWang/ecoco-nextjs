"use client";

import { useState, useEffect, useRef } from "react";
import {
  Container,
  Stack,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import StationCard from "@/components/station/StationCard";
import { Station } from "@/types/station";
import StationFilter from "@/components/station/StationFilter";
import { useUserLocation } from "@/hooks/useUserLocation";
import { calculateStationDistance } from "@/lib/utils/calculateStationDistance";

interface StationClientPageProps {
  initialStations: Station[];
}

// 這是純粹的客戶端組件，負責 UI 互動
export default function StationClientPage({
  initialStations,
}: StationClientPageProps) {
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useUserLocation();

  // 產生 cityOptions 與 districtMap
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
  const [stationList, setStationList] = useState<Station[]>(initialStations);
  const [isSorted, setIsSorted] = useState(false);
  const [showLocationError, setShowLocationError] = useState(false);

  useEffect(() => {
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
      setStationList(stationsWithDistance);
      setIsSorted(true);
    }
  }, [location, initialStations]);

  useEffect(() => {
    if (locationError) {
      setShowLocationError(true);
      // 在實務上，可能會想在這裡使用一個提示或日誌服務，記錄用戶沒開位置授權的比例
      console.warn("無法取得位置:", locationError.message);
    }
  }, [locationError]);

  const handleToggleFavorite = (id: string) => {
    setStationList(prev =>
      prev.map(s => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
  };

  const handleCloseLocationError = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowLocationError(false);
  };

  const parentRef = useRef<HTMLDivElement>(null);

  const filteredStations = stationList.filter(s => {
    // 關鍵字比對站名
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
      if (["PET", "HDPE", "PP"].includes(filter.category)) {
        if (
          !s.items.plastics ||
          !s.items.plastics.enabled ||
          !s.items.plastics.types.includes(filter.category as any)
        )
          return false;
      }
    }
    return true;
  });

  const rowVirtualizer = useVirtualizer({
    count: filteredStations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 190, // 提供一個接近平均卡片高度的合理估計值
    overscan: 5, // 在可見範圍外預先渲染 5 個項目
    gap: 0, // 間距由組件內的 padding 手動控制
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
          height: {
            xs: "calc(100vh - 164px)", // 手機版高度
            sm: "calc(100vh - 172px)", // 平板與桌面版高度
          },
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {locationLoading || (location && !isSorted) ? (
            <Typography variant="body2" sx={{ textAlign: "center", my: 2 }}>
              正在取得您的位置以排序站點...
            </Typography>
          ) : (
            rowVirtualizer.getVirtualItems().map(virtualItem => {
              const station = filteredStations[virtualItem.index];
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
                    <StationCard {...station} />
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
