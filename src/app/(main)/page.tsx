import { auth } from "@/lib/auth/auth";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BrandAdvertisingCarousel from "@/components/BrandAdvertisingCarousel";
import MembershipCard from "@/components/MembershipCard";
import ShortcutButtons from "@/components/ShortcutButtons";
import { getMembershipCardInfo } from "@/lib/db/user";
import { calculateCO2Saved } from "@/lib/utils/calculateCO2Saved";

export default async function Home() {
  const session = await auth();
  let membershipCardProps = {
    id: "",
    name: "",
    phone: "",
    ecocoPoints: 0,
    ecocoCoins: 0,
    co2Saved: 0,
  };
  if (session?.user?.id) {
    const memberInfo = await getMembershipCardInfo(session?.user?.id);
    if (memberInfo.success && memberInfo.user) {
      const co2Saved = calculateCO2Saved({
        totalPETCount: memberInfo.user.totalPETCount,
        totalHDPECount: memberInfo.user.totalHDPECount,
        totalPPCount: memberInfo.user.totalPPCount,
        totalAluminumCanCount: memberInfo.user.totalAluminumCanCount,
        totalBatteryCount: memberInfo.user.totalBatteryCount,
      });

      membershipCardProps = {
        id: memberInfo.user.id,
        name: memberInfo.user.name ?? "",
        phone: memberInfo.user.phoneNumber ?? "",
        ecocoPoints: memberInfo.user.currentEcocoPoints ?? 0, //資料庫有default(0)，但還是防呆一下
        ecocoCoins: memberInfo.user.currentEcocoCoins ?? 0,
        co2Saved: co2Saved ?? 0,
      };
    }
  }
  // AppBar 高度預設 64px (MUI 預設 desktop)，如需支援 mobile 可用 theme.breakpoints
  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 8 } }}>
      <MembershipCard {...membershipCardProps} />
      <BrandAdvertisingCarousel />
      <ShortcutButtons />

      <Typography variant="h4" fontWeight="bold" color="text.primary" mb={3}>
        歡迎來到 ECOCO
      </Typography>
      <Box mb={4} p={2} borderRadius={2} bgcolor="emerald.50">
        <Typography variant="h6" fontWeight="semibold" color="emerald.700">
          今日環保貢獻
        </Typography>
        <Typography color="emerald.600">減少碳排放：2.5 kg</Typography>
      </Box>
      <Box boxShadow={1} borderRadius={2} p={2} bgcolor="white">
        <Typography
          variant="h6"
          fontWeight="semibold"
          color="text.primary"
          mb={1}
        >
          最新活動
        </Typography>
        <Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2} mb={1}>
            <Typography color="text.secondary">
              新會員註冊送 100 點環保積分！
            </Typography>
          </Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2}>
            <Typography color="text.secondary">
              本週站點回收量達標，額外獎勵 50%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box boxShadow={1} borderRadius={2} p={2} bgcolor="white">
        <Typography
          variant="h6"
          fontWeight="semibold"
          color="text.primary"
          mb={1}
        >
          最新活動
        </Typography>
        <Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2} mb={1}>
            <Typography color="text.secondary">
              新會員註冊送 100 點環保積分！
            </Typography>
          </Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2}>
            <Typography color="text.secondary">
              本週站點回收量達標，額外獎勵 50%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box boxShadow={1} borderRadius={2} p={2} bgcolor="white">
        <Typography
          variant="h6"
          fontWeight="semibold"
          color="text.primary"
          mb={1}
        >
          最新活動
        </Typography>
        <Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2} mb={1}>
            <Typography color="text.secondary">
              新會員註冊送 100 點環保積分！
            </Typography>
          </Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2}>
            <Typography color="text.secondary">
              本週站點回收量達標，額外獎勵 50%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box boxShadow={1} borderRadius={2} p={2} bgcolor="white">
        <Typography
          variant="h6"
          fontWeight="semibold"
          color="text.primary"
          mb={1}
        >
          最新活動
        </Typography>
        <Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2} mb={1}>
            <Typography color="text.secondary">
              新會員註冊送 100 點環保積分！
            </Typography>
          </Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2}>
            <Typography color="text.secondary">
              本週站點回收量達標，額外獎勵 50%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box boxShadow={1} borderRadius={2} p={2} bgcolor="white">
        <Typography
          variant="h6"
          fontWeight="semibold"
          color="text.primary"
          mb={1}
        >
          最新活動
        </Typography>
        <Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2} mb={1}>
            <Typography color="text.secondary">
              新會員註冊送 100 點環保積分！
            </Typography>
          </Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2}>
            <Typography color="text.secondary">
              本週站點回收量達標，額外獎勵 50%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box boxShadow={1} borderRadius={2} p={2} bgcolor="white">
        <Typography
          variant="h6"
          fontWeight="semibold"
          color="text.primary"
          mb={1}
        >
          最新活動
        </Typography>
        <Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2} mb={1}>
            <Typography color="text.secondary">
              新會員註冊送 100 點環保積分！
            </Typography>
          </Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2}>
            <Typography color="text.secondary">
              本週站點回收量達標，額外獎勵 50%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box boxShadow={1} borderRadius={2} p={2} bgcolor="white">
        <Typography
          variant="h6"
          fontWeight="semibold"
          color="text.primary"
          mb={1}
        >
          最新活動
        </Typography>
        <Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2} mb={1}>
            <Typography color="text.secondary">
              新會員註冊送 100 點環保積分！
            </Typography>
          </Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2}>
            <Typography color="text.secondary">
              本週站點回收量達標，額外獎勵 50%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box boxShadow={1} borderRadius={2} p={2} bgcolor="white">
        <Typography
          variant="h6"
          fontWeight="semibold"
          color="text.primary"
          mb={1}
        >
          最新活動
        </Typography>
        <Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2} mb={1}>
            <Typography color="text.secondary">
              新會員註冊送 100 點環保積分！
            </Typography>
          </Box>
          <Box borderLeft={4} borderColor="emerald.500" pl={2}>
            <Typography color="text.secondary">
              本週站點回收量達標，額外獎勵 50%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
