"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const SCROLL_SENSITIVE_ROUTES = ["/", "/profile"]; // [設定] 哪些頁面需要滾動觸發陰影
const ELEVATED_ROUTES = ["/stations", "/partners"]; // [設定] 哪些頁面需要固定陰影

export type MainAppBarProps = {
  showLogo?: boolean;
  showNotification?: boolean;
  rightContent?: React.ReactNode;
};

const MainAppBar: React.FC<MainAppBarProps> = ({
  showLogo = true,
  showNotification = true,
  rightContent,
}) => {
  const pathname = usePathname();
  const [elevation, setElevation] = useState(0);
  const lastElevationRef = useRef(0);

  useEffect(() => {
    const scrollContainer = document.getElementById(
      "main-content-scroll-container"
    );
    const scrollThreshold = 152 - 56; //[設定]滾動多少會觸發陰影
    const basicElevation = 2; //[設定]基本陰影

    const handleScroll = () => {
      if (!scrollContainer) return;

      const currentScrollTop = scrollContainer.scrollTop;
      const newElevation =
        currentScrollTop > scrollThreshold ? basicElevation : 0;

      if (lastElevationRef.current !== newElevation) {
        console.log(`scroll trigger > ${scrollThreshold}`);
        lastElevationRef.current = newElevation;
        setElevation(newElevation);
      }
    };

    if (ELEVATED_ROUTES.includes(pathname)) {
      // 不註冊滾動事件
      setElevation(basicElevation);
      lastElevationRef.current = basicElevation;
      return;
    }

    if (SCROLL_SENSITIVE_ROUTES.includes(pathname) && scrollContainer) {
      setElevation(0);
      lastElevationRef.current = 0;
      // 註冊滾動事件監聽器
      scrollContainer.addEventListener("scroll", handleScroll);

      // 在元件卸載或 pathname 改變時，移除事件監聽器
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }

    setElevation(0); // 處理其他非滾動、非固定陰影的頁面，確保 elevation 初始為 0
    lastElevationRef.current = 0;
  }, [pathname]);

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={elevation}
      sx={theme => ({ zIndex: 50, bgcolor: theme.palette.secondary.main })}
    >
      <Toolbar>
        {showLogo ? (
          <Box
            component="img"
            src="/icons/ecoco-app-bar-logo.png"
            alt="Logo"
            sx={{ height: 32, width: "auto" }}
          />
        ) : (
          <Box sx={{ width: 48 }} />
        )}
        <Box sx={{ flexGrow: 1 }} />
        {showNotification && (
          <IconButton
            color="inherit"
            aria-label="通知"
            tabIndex={0}
            sx={{ ml: 1 }}
          >
            <NotificationsNoneOutlinedIcon />
          </IconButton>
        )}
        {rightContent && <Box sx={{ ml: 1 }}>{rightContent}</Box>}
      </Toolbar>
    </AppBar>
  );
};

export default MainAppBar;
