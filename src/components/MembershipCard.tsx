"use client";
import React from "react";
import { Card, Avatar, Box, Typography, SvgIcon, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import avatar from "@/assets/home-images/avatar-liangbao.png";
import EcocoPointsIcon from "@/assets/icons/ecoco-point.svg";
import EcocoCoinsIcon from "@/assets/icons/ecoco-coin.svg";
import Co2SavedIcon from "@/assets/icons/co2-saved.svg";

type MemberCardProps = {
  id: string;
  name: string;
  phone: string;
  ecocoPoints: number;
  ecocoCoins: number;
  co2Saved: number; //單位公克
};

// 1. 拆分出的「未登入」狀態卡片
const LoginPromptCard: React.FC = () => {
  const router = useRouter();
  return (
    <Card
      elevation={2}
      sx={{ borderRadius: 2, mb: 1, cursor: "pointer" }}
      onClick={() => router.push("/login")}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          minHeight: "112px",
        }}
      >
        {/* <Box sx={{ borderBottom: 1.5, borderColor: "black" }}> */}
        <Typography variant="h6" fontWeight="bold">
          登入/註冊
        </Typography>
      </Box>
      {/* </Box> */}
    </Card>
  );
};

// 2. 拆分出的「數據項目」子組件
const StatItem: React.FC<{ icon: React.ElementType; value: string }> = ({
  icon: Icon,
  value,
}) => (
  <Box display="flex" alignItems="center" justifyContent="space-between">
    <SvgIcon component={Icon} inheritViewBox />
    <Typography ml={1}>{value}</Typography>
  </Box>
);

// 3. 拆分出的「已登入」狀態卡片
const UserDetailsCard: React.FC<MemberCardProps> = ({
  name,
  phone,
  ecocoPoints,
  ecocoCoins,
  co2Saved,
}) => (
  <Card elevation={2} sx={{ borderRadius: 2, mb: 1 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        minHeight: "112px",
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar
          src={avatar.src}
          alt={name}
          sx={{ width: "64px", height: "64px" }}
        />
        <Box ml={2}>
          <Typography variant="h6" fontWeight="bold">
            {name.length > 0 ? name : "可可粉"}
          </Typography>
          {phone.length > 0 ? (
            <Typography variant="body2" color="text.secondary">
              {`#${phone.slice(-4)}`}
            </Typography>
          ) : (
            <Link href="/profile/verify-phone" passHref>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  py: 0.25,
                  px: 1,
                  textTransform: "none",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                前往驗證手機
              </Button>
            </Link>
          )}
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        gap={0.5}
      >
        <StatItem icon={EcocoPointsIcon} value={ecocoPoints.toLocaleString()} />
        <StatItem icon={EcocoCoinsIcon} value={ecocoCoins.toLocaleString()} />
        <StatItem icon={Co2SavedIcon} value={`${co2Saved.toFixed(2)} g`} />
      </Box>
    </Box>
  </Card>
);

// 4. 主組件現在只負責邏輯判斷和調度
const MembershipCard: React.FC<MemberCardProps> = props => {
  if (props.id.length === 0) {
    return <LoginPromptCard />;
  }
  return <UserDetailsCard {...props} />;
};

export default MembershipCard;
