"use client";
import { Box } from "@mui/material";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

type AppContentWrapperProps = {
  children: ReactNode;
  hasBottomNavigation?: boolean;
};

const AppContentWrapper = ({
  children,
  hasBottomNavigation,
}: AppContentWrapperProps) => {
  const pathname = usePathname();
  const allowedTopBackground = ["/", "/profile"];
  const hasTopBackground = allowedTopBackground.includes(pathname);

  return (
    // 這是一個沒有背景的滾動容器
    <Box
      id="main-content-scroll-container"
      sx={theme => ({
        height: "100vh",
        width: "100%",
        overflow: "auto",
        backgroundColor: theme.palette.background.default,
      })}
    >
      {/* 這裡的 Box 才是真正的內容區塊，它將包含背景和子元件 */}
      <Box
        sx={theme => ({
          minHeight: "100%", // 確保內容區塊至少與容器一樣高
          backgroundImage: hasTopBackground
            ? `linear-gradient(to bottom, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.main} 152px, ${theme.palette.background.default} 152px, ${theme.palette.background.default} 100%)`
            : "none",
          backgroundColor: hasTopBackground
            ? "transparent"
            : theme.palette.background.default,
          pt: { xs: "56px", sm: "64px" },
          pb: hasBottomNavigation ? { xs: "72px", sm: "80px" } : 0,
        })}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppContentWrapper;
