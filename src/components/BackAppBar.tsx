"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

//自訂子頁面title名稱
const PATH_TITLES: { [key: string]: string } = {
  "/profile/verify-phone": "手機驗證",
  "/product_detail": "商品詳情",
  "/profile/coupon-wallet": "票券匣",
  "/profile/points-history": "點數歷程",
  "/profile/favorite-stations": "常用站點",
};

export type BackAppBarProps = {
  noTitleRoutes?: string[];
  title?: string;
  elevation?: number;
};

const BackAppBar: React.FC<BackAppBarProps> = ({
  noTitleRoutes = [],
  title: customTitle,
  elevation = 2,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  const handleKeyDownBack = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      handleBack();
    }
  };

  const getTitle = () => {
    if (customTitle) return customTitle;
    if (noTitleRoutes.includes(pathname)) return "";

    const matchingPath = Object.keys(PATH_TITLES).find(path =>
      pathname.includes(path)
    );
    return matchingPath ? PATH_TITLES[matchingPath] : "";
  };

  const title = getTitle();

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={elevation}
      sx={theme => ({ zIndex: 50, bgcolor: theme.palette.secondary.main })}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="返回"
          tabIndex={0}
          onClick={handleBack}
          onKeyDown={handleKeyDownBack}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "left" }}>
          {title && (
            <Typography variant="h6" component="div" noWrap>
              {title}
            </Typography>
          )}
        </Box>

        <Box sx={{ width: 48, ml: 1 }} />
      </Toolbar>
    </AppBar>
  );
};

export default BackAppBar;
