import { Coupon } from "@/types/coupon";
import { Box, Typography, Paper, Button, Card } from "@mui/material";
import Image from "next/image";

interface CouponCardProps {
  coupon: Coupon;
}

const statusMap = {
  available: { text: "可兌換", color: "primary.main" },
  redeemed: { text: "已兌換", color: "text.disabled" },
  expired: { text: "已過期", color: "text.disabled" },
};

export default function CouponCard({ coupon }: CouponCardProps) {
  const handleCardClick = () => {
    // Navigate to coupon details page (to be implemented)
    console.log("Coupon clicked:", coupon.id);
  };

  const { text: statusText, color: statusColor } =
    statusMap[coupon.status] || statusMap.expired;

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        overflow: "visible", // Allow notches to overflow
        cursor: coupon.status === "available" ? "pointer" : "default",
        filter: coupon.status !== "available" ? "grayscale(1)" : "none",
        position: "relative",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
      onClick={coupon.status === "available" ? handleCardClick : undefined}
    >
      {/* Left Side (Image) */}
      <Box
        sx={{
          width: "20%",
          py: 1,
          pl: 1,
          pr: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative", // Keep this for the inner box positioning
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src={coupon.image}
            alt={coupon.title}
            fill
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>

      {/* Middle (Details) */}
      <Box
        sx={{
          flex: 1,
          p: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderColor: "divider",
          overflow: "hidden", // Add this to contain the text
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {coupon.title}
        </Typography>
        <Typography
          variant="caption"
          color="text.primary"
          sx={{
            mt: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {coupon.subtitle}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          兌換期限: {coupon.expiresIn}
        </Typography>
      </Box>

      {/* Dotted Divider with Notches */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "80%", // Position the center of the divider at 80%
          transform: "translateX(-50%)", // Center the divider itself
          width: "4px",
          borderLeft: "4px dotted",
          borderColor: "background.default",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -10,
            left: "-10px", // Adjust notch position to be centered on the line
            width: 16,
            height: 16,
            bgcolor: "background.default",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -10,
            left: "-10px",
            width: 16,
            height: 16,
            bgcolor: "background.default",
            borderRadius: "50%",
          }}
        />
      </Box>

      {/* Right Side (Status) */}
      <Box
        sx={{
          width: "20%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: coupon.status === "available" ? "primary.main" : "grey.300",
          //   borderRadius: 1,
          color:
            coupon.status === "available"
              ? "primary.contrastText"
              : "text.secondary",
        }}
      >
        <Typography variant="button" sx={{ fontWeight: "bold" }}>
          {statusText}
        </Typography>
      </Box>
    </Card>
  );
}
