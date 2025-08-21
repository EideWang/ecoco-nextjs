"use client";

import { useState } from "react";
import { Box, Tab, Tabs, Container, Typography, AppBar } from "@mui/material";
import CouponList from "@/components/coupon/CouponList";
import { mockCoupons } from "@/_data/coupons";

function a11yProps(index: number) {
  return {
    id: `coupon-tab-${index}`,
    "aria-controls": `coupon-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`coupon-tabpanel-${index}`}
      aria-labelledby={`coupon-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2, px: { xs: 2, sm: 4, md: 8 } }}>{children}</Box>
      )}
    </div>
  );
}

export default function CouponWalletPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: { xs: "56px", sm: "64px" },
          zIndex: 40,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="coupon tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="可兌換" {...a11yProps(0)} />
          <Tab label="已兌換" {...a11yProps(1)} />
          <Tab label="已過期" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <CustomTabPanel value={value} index={0}>
        <CouponList
          coupons={mockCoupons.filter(c => c.status === "available")}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CouponList
          coupons={mockCoupons.filter(c => c.status === "redeemed")}
        />
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="caption" color="text.secondary">
            僅顯示近三個月紀錄
          </Typography>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <CouponList coupons={mockCoupons.filter(c => c.status === "expired")} />
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="caption" color="text.secondary">
            僅顯示近三個月紀錄
          </Typography>
        </Box>
      </CustomTabPanel>
    </Box>
  );
}
