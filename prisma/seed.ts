import { User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

async function main() {
  console.log("Seeding started...");

  // --- Clean up existing data ---
  console.log("Cleaning up database...");
  await prisma.userCoupon.deleteMany();
  await prisma.redemptionLog.deleteMany();
  await prisma.couponCode.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.userFavoriteStation.deleteMany();
  await prisma.stationCampaign.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.recyclableItem.deleteMany();
  await prisma.station.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // --- Create Users ---
  console.log("Creating users...");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  const users = await prisma.user.createManyAndReturn({
    data: [
      // 1. User with Phone & Password (simulating old system)
      {
        name: "舊系統使用者",
        phoneNumber: "0912345678",
        phoneNumberVerified: new Date(),
        password: hashedPassword,
        email: "legacy.user@example.com", // email might be optional
        city: "臺北市",
        district: "中正區",
        currentEcocoPoints: 1000,
        currentEcocoCoins: 7000,
        totalPETCount: 9,
        totalHDPECount: 87,
        totalPPCount: 65,
        totalAluminumCanCount: 43,
        totalBatteryCount: 210,
      },
      // 2. User via Google OAuth
      {
        name: "Google 使用者",
        email: "google.user@example.com",
        emailVerified: new Date(),
        image: faker.image.avatar(),
      },
      // 3. User via Line OAuth
      {
        name: "Line 使用者",
        email: "line.user@example.com",
        emailVerified: new Date(),
        image: faker.image.avatar(),
      },
      // 4. More fake users
      ...Array.from({ length: 10 }).map(() => ({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        emailVerified: new Date(),
        phoneNumber: faker.helpers.fromRegExp(/09[0-9]{8}/),
        phoneNumberVerified: new Date(),
        password: hashedPassword,
        image: faker.image.avatar(),
        city: "新北市",
        district: "板橋區",
        currentEcocoPoints: faker.number.int({ min: 100, max: 10000 }),
        currentEcocoCoins: faker.number.int({ min: 100, max: 10000 }),
        totalPETCount: faker.number.int({ min: 0, max: 100 }),
        totalHDPECount: faker.number.int({ min: 0, max: 100 }),
        totalPPCount: faker.number.int({ min: 0, max: 100 }),
        totalAluminumCanCount: faker.number.int({ min: 0, max: 100 }),
        totalBatteryCount: faker.number.int({ min: 0, max: 100 }),
      })),
    ],
  });

  // Create corresponding accounts for OAuth users
  const googleUser = users.find(
    (u: User) => u.email === "google.user@example.com"
  );
  const lineUser = users.find((u: User) => u.email === "line.user@example.com");

  if (googleUser) {
    await prisma.account.create({
      data: {
        userId: googleUser.id,
        type: "oauth",
        provider: "google",
        providerAccountId: faker.string.uuid(),
      },
    });
  }

  if (lineUser) {
    await prisma.account.create({
      data: {
        userId: lineUser.id,
        type: "oauth",
        provider: "line",
        providerAccountId: faker.string.uuid(),
      },
    });
  }

  // --- Create Stations ---
  console.log("Creating stations...");

  const dummyStations = [
    {
      name: "臺北市中正區",
      lat: 25.033,
      lng: 121.516,
      city: "臺北市",
      district: "中正區",
    },
    {
      name: "臺北市大同區",
      lat: 25.06,
      lng: 121.51,
      city: "臺北市",
      district: "大同區",
    },
    {
      name: "臺北市中山區",
      lat: 25.052,
      lng: 121.535,
      city: "臺北市",
      district: "中山區",
    },
    {
      name: "臺北市松山區",
      lat: 25.053,
      lng: 121.559,
      city: "臺北市",
      district: "松山區",
    },
    {
      name: "臺北市大安區",
      lat: 25.025,
      lng: 121.545,
      city: "臺北市",
      district: "大安區",
    },
    {
      name: "臺北市萬華區",
      lat: 25.03,
      lng: 121.503,
      city: "臺北市",
      district: "萬華區",
    },
    {
      name: "臺北市信義區",
      lat: 25.033,
      lng: 121.563,
      city: "臺北市",
      district: "信義區",
    },
    {
      name: "臺北市士林區",
      lat: 25.09,
      lng: 121.53,
      city: "臺北市",
      district: "士林區",
    },
    {
      name: "臺北市北投區",
      lat: 25.13,
      lng: 121.5,
      city: "臺北市",
      district: "北投區",
    },
    {
      name: "臺北市內湖區",
      lat: 25.07,
      lng: 121.59,
      city: "臺北市",
      district: "內湖區",
    },
    {
      name: "臺北市南港區",
      lat: 25.05,
      lng: 121.6,
      city: "臺北市",
      district: "南港區",
    },
    {
      name: "臺北市文山區",
      lat: 24.98,
      lng: 121.57,
      city: "臺北市",
      district: "文山區",
    },
    {
      name: "新北市板橋區",
      lat: 25.01,
      lng: 121.46,
      city: "新北市",
      district: "板橋區",
    },
    {
      name: "新北市三重區",
      lat: 25.07,
      lng: 121.48,
      city: "新北市",
      district: "三重區",
    },
    {
      name: "新北市中和區",
      lat: 24.99,
      lng: 121.51,
      city: "新北市",
      district: "中和區",
    },
    {
      name: "新北市永和區",
      lat: 25.0,
      lng: 121.51,
      city: "新北市",
      district: "永和區",
    },
    {
      name: "新北市新莊區",
      lat: 25.03,
      lng: 121.45,
      city: "新北市",
      district: "新莊區",
    },
    {
      name: "新北市新店區",
      lat: 24.96,
      lng: 121.53,
      city: "新北市",
      district: "新店區",
    },
    {
      name: "新北市土城區",
      lat: 24.98,
      lng: 121.45,
      city: "新北市",
      district: "土城區",
    },
    {
      name: "新北市蘆洲區",
      lat: 25.08,
      lng: 121.47,
      city: "新北市",
      district: "蘆洲區",
    },
    {
      name: "桃園市桃園區",
      lat: 24.99,
      lng: 121.31,
      city: "桃園市",
      district: "桃園區",
    },
    {
      name: "桃園市中壢區",
      lat: 24.95,
      lng: 121.22,
      city: "桃園市",
      district: "中壢區",
    },
    {
      name: "臺中市西屯區",
      lat: 24.17,
      lng: 120.64,
      city: "臺中市",
      district: "西屯區",
    },
    {
      name: "臺中市北屯區",
      lat: 24.18,
      lng: 120.7,
      city: "臺中市",
      district: "北屯區",
    },
    {
      name: "臺南市東區",
      lat: 22.99,
      lng: 120.22,
      city: "臺南市",
      district: "東區",
    },
    {
      name: "臺南市中西區",
      lat: 22.98,
      lng: 120.18,
      city: "臺南市",
      district: "中西區",
    },
    {
      name: "臺南市南區",
      lat: 22.96,
      lng: 120.19,
      city: "臺南市",
      district: "南區",
    },
    {
      name: "臺南市永康區",
      lat: 23.02,
      lng: 120.25,
      city: "臺南市",
      district: "永康區",
    },
    {
      name: "高雄市三民區",
      lat: 22.65,
      lng: 120.31,
      city: "高雄市",
      district: "三民區",
    },
    {
      name: "高雄市左營區",
      lat: 22.67,
      lng: 120.29,
      city: "高雄市",
      district: "左營區",
    },
  ];

  const openHoursOptions = [
    "09:00~21:00",
    "10:00~22:00",
    "08:00~20:00",
    "24H",
    "11:00~19:00",
  ];

  const channelBrands = [
    "全家",
    "7-ELEVEN",
    "萊爾富",
    "OK超商",
    "全聯福利中心",
    "家樂福",
    "大潤發",
    "愛買",
    "小北百貨",
    "寶雅",
  ];

  type PlasticType = "PET" | "HDPE" | "PP";

  const plasticTypeCombinations: PlasticType[][] = [
    ["PET"],
    ["HDPE"],
    ["PP"],
    ["PET", "HDPE"],
    ["PET", "PP"],
    ["HDPE", "PP"],
    ["PET", "HDPE", "PP"],
  ];

  const getRecyclableItemsForStation = (
    index: number,
    plasticCombinations: PlasticType[][]
  ) => {
    const allItems = [
      {
        itemType: "PLASTICS" as const,
        enabled: faker.datatype.boolean(),
        remaining: faker.number.int({ min: 0, max: 1000 }),
        plasticTypes: plasticCombinations[index % plasticCombinations.length],
      },
      {
        itemType: "ALU" as const,
        enabled: faker.datatype.boolean(),
        remaining: faker.number.int({ min: 0, max: 1000 }),
        plasticTypes: [],
      },
      {
        itemType: "BATTERY" as const,
        enabled: faker.datatype.boolean(),
        remaining: faker.number.int({ min: 0, max: 500 }),
        plasticTypes: [],
      },
    ];

    // Scenarios based on station index
    if (index % 5 === 0) {
      // Only battery
      return [allItems[2]];
    }
    if (index % 5 === 1) {
      // No battery
      return [allItems[0], allItems[1]];
    }
    if (index % 5 === 2) {
      // No ALU
      return [allItems[0], allItems[2]];
    }
    // Default: all items
    return allItems;
  };

  const stations = await Promise.all(
    dummyStations.map((station, i) => {
      const brand = channelBrands[i % channelBrands.length];
      const storeName = `${faker.lorem.word()}${faker.lorem.word()}`;
      const stationName = `${brand}${station.district}${storeName}店`;

      return prisma.station.create({
        data: {
          id: `es${String(i).padStart(4, "0")}`,
          name: stationName,
          address: `${station.city}${station.district}${faker.location.streetAddress()}`,
          city: station.city,
          district: station.district,
          lat: station.lat + (Math.random() - 0.5) * 0.01, // Add small jitter
          lng: station.lng + (Math.random() - 0.5) * 0.01, // Add small jitter
          openHours: openHoursOptions[i % openHoursOptions.length],
          isOpen: faker.datatype.boolean(0.9), // 90% chance of being open
          showOnWeb: true,
          recyclableItems: {
            create: getRecyclableItemsForStation(i, plasticTypeCombinations),
          },
        },
      });
    })
  );

  // --- Create Campaigns ---
  console.log("Creating campaigns...");
  const campaigns = await prisma.campaign.createManyAndReturn({
    data: [
      {
        id: "promo_double_points",
        name: "點數雙倍送",
        type: "POINTS_BONUS",
        priority: 1,
        icon: "✨",
        color: "#4CAF50",
        textColor: "#FFFFFF",
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        shortDescription: "回收廢電池，點數加倍！",
      },
      {
        id: "event_eco_fair",
        name: "週末環保市集",
        type: "EVENT",
        priority: 2,
        icon: "🌳",
        color: "#2196F3",
        textColor: "#FFFFFF",
        startDate: faker.date.future(),
        endDate: faker.date.future(),
        shortDescription: "多樣環保攤位與講座。",
      },
    ],
  });

  // --- Associate Campaigns with Stations ---
  console.log("Associating campaigns with stations...");
  for (const station of stations.slice(0, 5)) {
    // First 5 stations have campaigns
    await prisma.stationCampaign.create({
      data: {
        stationId: station.id,
        campaignId: campaigns[0].id,
      },
    });
  }

  // --- Make some users favorite some stations ---
  console.log("Creating favorite stations for users...");
  for (const user of users.slice(0, 5) as User[]) {
    for (const station of stations.slice(0, 3)) {
      if (faker.datatype.boolean()) {
        await prisma.userFavoriteStation.create({
          data: {
            userId: user.id,
            stationId: station.id,
          },
        });
      }
    }
  }

  // --- Create Partners ---
  console.log("Creating partners...");
  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: "家樂福 Carrefour",
        description: "量販領導品牌",
        logoUrl: "/assets/coupons/coupon-carrefour.png",
        createdAt: new Date(),
      },
    }),
    prisma.partner.create({
      data: {
        name: "迷客夏 Milksha",
        description: "綠光牧場主題飲品",
        logoUrl: "/assets/coupons/coupon-milksha.png",
        createdAt: new Date(),
      },
    }),
    prisma.partner.create({
      data: {
        name: "秀泰影城",
        description: "高品質電影院",
        logoUrl: "/assets/coupons/coupon-showba.png",
        createdAt: new Date(),
      },
    }),
  ]);

  // --- Create Coupons and CouponCodes ---
  console.log("Creating coupons and codes...");

  // 1. Coupon with Serial Numbers (pre-generated)
  const milkshaCoupon = await prisma.coupon.create({
    data: {
      partnerId: partners[1].id,
      title: "大杯紅茶拿鐵折價 $15",
      description: "使用ECOCO點數兌換，全台迷客夏門市適用。",
      imageUrl: "/assets/coupons/coupon-milksha.png",
      pointsCost: 150,
      redemptionType: "SERIAL_NUMBER",
      totalQuantity: 100,
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      validityDays: 30,
      termsAndConditions:
        "1. 本券不得與其他優惠合併使用。\n2. 需於有效期限內使用。",
      couponCodes: {
        create: Array.from({ length: 100 }).map(() => ({
          code: `MK-${faker.string.alphanumeric(8).toUpperCase()}`,
        })),
      },
    },
  });

  // 2. Coupon with Barcode (also pre-generated codes)
  const carrefourCoupon = await prisma.coupon.create({
    data: {
      partnerId: partners[0].id,
      title: "消費滿千折百",
      description: "ECOCO會員專屬，於全台家樂福使用。",
      imageUrl: "/assets/coupons/coupon-carrefour.png",
      coinsCost: 50,
      redemptionType: "BARCODE",
      totalQuantity: 200,
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      validityDays: 60,
      termsAndConditions: "詳情請見店內公告。",
      couponCodes: {
        create: Array.from({ length: 200 }).map(() => ({
          code: faker.string.numeric(13), // Barcodes are often numeric
        })),
      },
    },
  });

  // 3. Coupon with Verification Code (on-the-spot)
  const showtimeCoupon = await prisma.coupon.create({
    data: {
      partnerId: partners[2].id,
      title: "電影票爆米花組合優惠",
      description: "出示核銷碼即可享有優惠。",
      imageUrl: "/assets/coupons/coupon-showba.png",
      pointsCost: 300,
      redemptionType: "VERIFICATION_CODE",
      totalQuantity: 500,
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      termsAndConditions: "不適用於特殊影廳。",
    },
  });

  // 4. A manually deactivated coupon
  await prisma.coupon.create({
    data: {
      partnerId: partners[2].id,
      title: "【已停用】可樂兌換券",
      description: "此活動因故已暫停。",
      imageUrl: "/assets/coupons/coupon-showba.png",
      pointsCost: 50,
      redemptionType: "VERIFICATION_CODE",
      totalQuantity: 100,
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      isActive: false, // Manually deactivated
    },
  });

  // 5. Coupon with a fixed expiration date
  await prisma.coupon.create({
    data: {
      partnerId: partners[0].id,
      title: "年終感謝祭 $50 折價券",
      description: "不限消費金額，全館商品適用。",
      imageUrl: "/assets/coupons/coupon-carrefour.png",
      pointsCost: 200,
      redemptionType: "BARCODE",
      totalQuantity: 1000,
      startDate: new Date(),
      endDate: new Date("2025-12-30T23:59:59Z"),
      fixedExpiresAt: new Date("2025-12-31T23:59:59Z"), // Fixed expiration date
      termsAndConditions: "本活動不得與其他優惠併用。",
      couponCodes: {
        create: Array.from({ length: 1000 }).map(() => ({
          code: faker.string.numeric(13),
        })),
      },
    },
  });

  // --- Simulate some user coupon redemptions ---
  console.log("Simulating coupon redemptions...");

  // User 1 redeems a Milksha coupon
  const availableMilkshaCode = await prisma.couponCode.findFirst({
    where: { couponId: milkshaCoupon.id, isAssigned: false },
  });

  if (availableMilkshaCode) {
    await prisma.$transaction(async tx => {
      const userCoupon = await tx.userCoupon.create({
        data: {
          userId: users[0].id,
          couponId: milkshaCoupon.id,
          serialNumber: availableMilkshaCode.code,
          expiresAt: faker.date.future(),
        },
      });
      await tx.couponCode.update({
        where: { id: availableMilkshaCode.id },
        data: { isAssigned: true, userCouponId: userCoupon.id },
      });
      await tx.coupon.update({
        where: { id: milkshaCoupon.id },
        data: { redeemedQuantity: { increment: 1 } },
      });
    });
    console.log(`User ${users[0].name} redeemed a Milksha coupon.`);
  }

  console.log("Seeding finished.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
