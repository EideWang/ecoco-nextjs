"use client";
import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

// 直接 import 圖片
import carousel01 from "@/assets/home-images/carousel-01.webp";
import carousel02 from "@/assets/home-images/carousel-02.webp";
import carousel03 from "@/assets/home-images/carousel-03.webp";
import carousel04 from "@/assets/home-images/carousel-04.webp";
import carousel05 from "@/assets/home-images/carousel-05.jpg";

const images = [
  {
    src: carousel01,
    alt: "Carousel image 1 - Google",
    linkUrl: "https://www.google.com/", // 第一張圖片連結到 Google
  },
  {
    src: carousel02,
    alt: "Carousel image 2 - Apple",
    linkUrl: "https://www.apple.com/", // 第二張圖片連結到 Apple
  },
  {
    src: carousel03,
    alt: "Carousel image 3 - Microsoft",
    linkUrl: "https://www.microsoft.com/", // 第三張圖片連結到 Microsoft
  },
  {
    src: carousel04,
    alt: "Carousel image 4 - Facebook (Meta)",
    linkUrl: "https://www.meta.com/", // 第四張圖片連結到 Meta (Facebook)
  },
  {
    src: carousel05,
    alt: "Carousel image 5 - Facebook (Meta)",
    linkUrl: "https://ani.gamer.com.tw/", // 第五張圖片連結到 巴哈大哥
  },
];
const carouselItems = images.map((image, index) => {
  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    // if (image.linkUrl) {
    //   // 檢查是否有連結
    //   // 判斷是內部路由還是外部網址
    //   if (image.isInternalLink) {
    //     // 假設 API 會告訴你這是內部連結
    //     navigate(image.linkUrl); // 使用 navigate 進行內部路由跳轉
    //   } else {
    //     window.open(image.linkUrl, "_blank", "noopener noreferrer"); // 外部網址在新視窗打開
    //   }
    // }
    window.open(image.linkUrl, "_blank", "noopener noreferrer"); // 外部網址在新視窗打開
  };
  return (
    <Box
      key={index}
      onClick={handleClick}
      sx={{
        width: "100%",
        aspectRatio: "16 / 9",
        px: 0,
        overflow: "hidden",
      }}
    >
      <img
        src={image.src.src}
        alt={`Carousel image ${index + 1}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          borderRadius: "16px",
        }}
      />
    </Box>
  );
});

const responsive = {
  //暫定
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
// Custom dot component
const CustomDot = ({ ...rest }) => {
  const {
    onMove,
    onClick,
    index,
    active,
    carouselState: { currentSlide, deviceType },
  } = rest;

  // onMove means if dragging or swiping in progress.
  // active is provided by this lib for checking if the item is active or not.
  return (
    <Box
      component="button"
      onClick={e => {
        onClick();
        e.preventDefault();
      }}
      sx={theme => ({
        width: "24px",
        height: "4px",
        borderRadius: "2px",
        border: "none",
        margin: "0 4px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        backgroundColor: active
          ? theme.palette.primary.main
          : theme.palette.grey[300],
        "&:hover": {
          backgroundColor: active
            ? theme.palette.primary.main
            : theme.palette.grey[300],
        },
        "&:focus": {
          outline: "none",
        },
      })}
      aria-label={`Go to slide ${index + 1}`}
    />
  );
};

export default function BrandAdvertisingCarousel() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const imagePromises = images.map(image => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image.src.src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => setLoading(false))
      .catch(err => console.error("Failed to load images", err));
  }, []);

  return (
    <Box
      // 讓Dot距離輪播圖多遠距離的客製化設定
      sx={{
        paddingBottom: loading ? 0 : 1,
        position: "relative",
        aspectRatio: "16 / 9",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="calc(100% + 8px)"
          sx={{ borderRadius: "16px" }}
        />
      ) : (
        <Carousel
          responsive={responsive}
          arrows={false}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          showDots={true}
          customDot={<CustomDot />}
          renderDotsOutside
        >
          {carouselItems}
        </Carousel>
      )}
    </Box>
  );
}
