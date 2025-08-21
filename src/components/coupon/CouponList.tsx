import { Coupon } from "@/types/coupon";
import CouponCard from "@/components/coupon/CouponCard";

interface CouponListProps {
  coupons: Coupon[];
}

export default function CouponList({ coupons }: CouponListProps) {
  if (coupons.length === 0) {
    return <div>沒有可用的優惠券</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {coupons.map(coupon => (
        <CouponCard key={coupon.id} coupon={coupon} />
      ))}
    </div>
  );
}
