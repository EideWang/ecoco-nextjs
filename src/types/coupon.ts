import { StaticImageData } from "next/image";

export type CouponStatus = "available" | "redeemed" | "expired";

export interface Coupon {
  id: string;
  image: StaticImageData;
  title: string;
  subtitle: string;
  expiresIn: string;
  status: CouponStatus;
}
