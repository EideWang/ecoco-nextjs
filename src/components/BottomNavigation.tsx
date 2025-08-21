"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import {
  HomeIcon,
  MapPinIcon,
  TicketIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  MapPinIcon as MapPinIconSolid,
  TicketIcon as TicketIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";

const navigation = [
  { name: "首頁", href: "/", Icon: HomeIcon, IconSolid: HomeIconSolid },
  {
    name: "站點",
    href: "/stations",
    Icon: MapPinIcon,
    IconSolid: MapPinIconSolid,
  },
  {
    name: "兌換",
    href: "/partners",
    Icon: TicketIcon,
    IconSolid: TicketIconSolid,
  },
  {
    name: "我的",
    href: "/profile",
    Icon: UserIcon,
    IconSolid: UserIconSolid,
  },
];

const getNavIndexByPath = (pathname: string) => {
  return navigation.findIndex(item => item.href === pathname);
};

const allowedRoutes = ["/", "/stations", "/partners", "/profile"];

export default function BottomNavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(getNavIndexByPath(pathname));

  useEffect(() => {
    setValue(getNavIndexByPath(pathname));
  }, [pathname]);

  // 僅在 allowedRoutes 才顯示 BottomNavigation
  if (!allowedRoutes.includes(pathname)) return null;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        width: "100%", // 佔滿整個寬度
        mx: "auto",
        px: 0,
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        boxShadow: 3,
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);
          router.push(navigation[newValue].href);
        }}
        aria-label="底部導覽列"
      >
        {navigation.map((item, idx) => {
          const isActive = value === idx;
          const Icon = isActive ? item.IconSolid : item.Icon;
          return (
            <BottomNavigationAction
              key={item.name}
              label={item.name}
              icon={<Icon className="h-6 w-6" aria-hidden="true" />}
              aria-label={item.name}
              tabIndex={0}
              sx={{
                color: isActive ? "primary.main" : "#6b7280",
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
          );
        })}
      </BottomNavigation>
    </Box>
  );
}
