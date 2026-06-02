import { connectDB } from "@/lib/db";
import { Coupon } from "@/lib/models";
import CouponForm from "../coupon-form";

async function getCoupon(id: string) {
  await connectDB();
  const coupon = await Coupon.findById(id).lean();
  return JSON.parse(JSON.stringify(coupon));
}

export default async function EditCouponPage({ params }: { params: { id: string } }) {
  const coupon = await getCoupon(params.id);
  return <CouponForm coupon={coupon} />;
}
