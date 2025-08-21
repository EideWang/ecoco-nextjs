"use client";

import { useState } from "react";
import { Stack, Button, Typography, Snackbar, Alert } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";

const shortcutButtonsData = [
  {
    label: "常用站點",
    icon: <StarBorderOutlinedIcon sx={{ fontSize: 32 }} />,
    href: "/profile/favorite-stations",
  },
  {
    label: "點數歷程",
    icon: <HistoryOutlinedIcon sx={{ fontSize: 32 }} />,
    href: "/profile/points-history",
  },
  {
    label: "票券夾",
    icon: <ConfirmationNumberOutlinedIcon sx={{ fontSize: 32 }} />,
    href: "/profile/coupon-wallet",
  },
  {
    label: "問題回報",
    icon: <FeedbackOutlinedIcon sx={{ fontSize: 32 }} />,
    href: "/report-issue",
  },
];

const ShortcutButtons = () => {
  const { status } = useSession();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (status !== "authenticated") {
      e.preventDefault();
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Stack
        direction={"row"}
        spacing={1}
        justifyContent="space-around"
        sx={{ width: "100%", pb: 1, backgroundColor: "background.default" }}
      >
        {shortcutButtonsData.map(buttonInfo => (
          <Button
            key={buttonInfo.label}
            component={Link}
            href={buttonInfo.href}
            variant="text"
            onClick={handleButtonClick}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              textTransform: "none",
              color: "text.primary",
              p: 1,
              flex: 1,
              maxWidth: "25%",
              // 移除點擊時的背景色變化，讓它更像一個靜態圖示連結
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                backgroundColor: "white", // 改為白色背景
                mb: 0.5,
                color: "primary.main", // 圖示顏色使用主色
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)", // 加上細微陰影增加立體感
              }}
            >
              {buttonInfo.icon}
            </Stack>
            <Typography
              variant="caption"
              sx={{ lineHeight: 1.2, fontWeight: "medium" }}
            >
              {buttonInfo.label}
            </Typography>
          </Button>
        ))}
      </Stack>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: { xs: 64, sm: 72 } }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          variant="filled"
          sx={{ width: "80%" }}
        >
          尚未登入/註冊
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShortcutButtons;
