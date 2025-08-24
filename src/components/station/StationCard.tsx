"use client";

import React from "react";
import {
  Card,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import Image from "next/image";
import StarOutlineIcon from "@mui/icons-material/StarBorderOutlined";
import StarIcon from "@mui/icons-material/Star";
import { isStationOpenNow } from "@/lib/utils/isStationOpenNow";

export type StationCardProps = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  isFavorite: boolean;
  distance?: number;
  openHours: string;
  items: {
    plastics?: {
      enabled: boolean;
      types: Array<"PET" | "HDPE" | "PP">;
      remaining: number;
    };
    alu?: { enabled: boolean; remaining: number };
    battery?: { enabled: boolean; remaining: number };
  };
  onToggleFavorite: (stationId: string) => void;
  isPending: boolean;
};

const getItemStatus = (item?: { enabled: boolean; remaining: number }) => {
  if (!item) return "";
  if (item.remaining === 0) return "滿袋";
  if (!item.enabled) return "維護中";
  return `可投 ${item.remaining}`;
};

const getDistanceText = (distance?: number) => {
  if (distance === undefined) return null;
  if (distance < 1000) return `${distance.toFixed(0)} 公尺`;
  return `${(distance / 1000).toFixed(1)} 公里`;
};

const openGoogleMaps = (lat: number, lng: number, name: string) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
    name
  )}`;
  window.open(url, "_blank");
};

const StationCard: React.FC<StationCardProps> = ({
  id,
  name,
  address,
  lat,
  lng,
  isFavorite,
  distance,
  openHours,
  items,
  onToggleFavorite,
  isPending,
}) => {
  const handleToggleFavorite = () => {
    onToggleFavorite(id);
  };

  const handleNavigate = () => openGoogleMaps(lat, lng, name);
  const handleFavoriteKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleFavorite();
    }
  };

  // 塑膠槽顏色
  // const plasticsColor = items.plastics?.remaining === 0 ? "#CACACA" : "#69B76B";
  // const aluColor = items.alu?.remaining === 0 ? "#CACACA" : "#69B76B";
  // const batteryColor = items.battery?.remaining === 0 ? "#CACACA" : "#69B76B";

  return (
    <Card
      sx={{
        borderRadius: 1,
        boxShadow: 2,
        // opacity: !isOpenNow(openHours) ? 0.6 : 1,
        // bgcolor: !isOpenNow(openHours) ? "grey.100" : "#fff",
        bgcolor: "#fff",
        mx: "auto",
      }}
      aria-disabled={!isStationOpenNow(openHours)}
    >
      <Box sx={{ p: 1.5 }}>
        {/* 標題與收藏 */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography
            variant="body1"
            color="text.primary"
            sx={{ lineHeight: 1.2 }}
          >
            {name}
          </Typography>
          <IconButton
            sx={{
              p: 0.5,
              // 覆寫 disabled 狀態的樣式
              "&.Mui-disabled": {
                color: theme =>
                  isFavorite
                    ? theme.palette.warning.main
                    : theme.palette.action.active,
                opacity: 1,
              },
            }}
            aria-label={isFavorite ? "移除收藏" : "加入收藏"}
            onClick={handleToggleFavorite}
            onKeyDown={handleFavoriteKeyDown}
            disabled={isPending}
            color={isFavorite ? "warning" : "default"}
            size="large"
          >
            {isFavorite ? <StarIcon /> : <StarOutlineIcon />}
          </IconButton>
        </Stack>
        {/* 地址、距離與導航 */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            // noWrap
            title={address}
            sx={{ flex: 1, lineHeight: 1.2 }}
          >
            {address}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleNavigate}
            sx={{ ml: 1, minWidth: 60, fontSize: "0.7rem" }}
            aria-label="導航到此站點"
          >
            導航{distance !== undefined && ` ${getDistanceText(distance)}`}
          </Button>
        </Stack>

        {/* 營業時間與距離 */}
        <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.2 }}
          >
            營業時間：{openHours}
            {!isStationOpenNow(openHours) && (
              <Box component="span" sx={{ color: "error.main", ml: 1 }}>
                休息中
              </Box>
            )}
          </Typography>
        </Stack>
        {/* 回收品項狀態 */}
        <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
          {/* 塑膠槽（PET/HDPE/PP） */}
          {items.plastics && (
            <Stack alignItems="center" justifyContent="flex-end">
              <Stack direction="row" spacing={0.25} mb={0}>
                {items.plastics.types.includes("PET") && (
                  <Box
                    sx={{
                      width: { xs: 32, sm: 40, md: 56, lg: 72 },
                      height: "auto",
                    }}
                  >
                    <Image
                      src={
                        items.plastics.enabled
                          ? "/icons/pet-on.png"
                          : "/icons/pet-off.png"
                      }
                      alt="PET"
                      width={144}
                      height={200}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Box>
                )}
                {items.plastics.types.includes("HDPE") && (
                  <Box
                    sx={{
                      width: { xs: 32, sm: 40, md: 56, lg: 72 },
                      height: "auto",
                    }}
                  >
                    <Image
                      src={
                        items.plastics.enabled
                          ? "/icons/hdpe-on.png"
                          : "/icons/hdpe-off.png"
                      }
                      alt="HDPE"
                      width={144}
                      height={200}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Box>
                )}
                {items.plastics.types.includes("PP") && (
                  <Box
                    sx={{
                      width: { xs: 32, sm: 40, md: 56, lg: 72 },
                      height: "auto",
                    }}
                  >
                    <Image
                      src={
                        items.plastics.enabled
                          ? "/icons/pp-on.png"
                          : "/icons/pp-off.png"
                      }
                      alt="PP"
                      width={144}
                      height={200}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Box>
                )}
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  color:
                    items.plastics.enabled && items.plastics.remaining > 0
                      ? "#0f7e13"
                      : "text.secondary",
                  lineHeight: 1.2,
                }}
              >
                {getItemStatus(items.plastics)}
              </Typography>
            </Stack>
          )}
          {/* 鋁罐 group */}
          {items.alu && (
            <Stack alignItems="center" justifyContent="flex-end">
              <Stack direction="row" spacing={0.25} mb={0}>
                <Box
                  sx={{
                    width: { xs: 32, sm: 40, md: 56, lg: 72 },
                    height: "auto",
                  }}
                >
                  <Image
                    src={
                      items.alu.enabled
                        ? "/icons/alu-on.png"
                        : "/icons/alu-off.png"
                    }
                    alt="ALU"
                    width={144}
                    height={200}
                    style={{ width: "100%", height: "auto" }}
                  />
                </Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  color:
                    items.alu.enabled && items.alu.remaining > 0
                      ? "#0f7e13"
                      : "text.secondary",
                  lineHeight: 1.2,
                }}
              >
                {getItemStatus(items.alu)}
              </Typography>
            </Stack>
          )}
          {/* 電池 group */}
          {items.battery && (
            <Stack alignItems="center" justifyContent="flex-end">
              <Stack direction="row" spacing={0.25} mb={0}>
                <Box
                  sx={{
                    width: { xs: 32, sm: 40, md: 56, lg: 72 },
                    height: "auto",
                  }}
                >
                  <Image
                    src={
                      items.battery.enabled
                        ? "/icons/battery-on.png"
                        : "/icons/battery-off.png"
                    }
                    alt="BATTERY"
                    width={144}
                    height={200}
                    style={{ width: "100%", height: "auto" }}
                  />
                </Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  color:
                    items.battery.enabled && items.battery.remaining > 0
                      ? "#0f7e13"
                      : "text.secondary",
                  lineHeight: 1.2,
                }}
              >
                {getItemStatus(items.battery)}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default StationCard;
