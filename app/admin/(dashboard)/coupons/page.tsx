import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/lib/models";

async function getCoupons() {
  await connectDB();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(coupons));
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Manage Coupons</h1>
        <Link href="/admin/coupons/new" className="btn-primary">Add Coupon</Link>
      </div>

      <div className="premium-card mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="p-4">Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Order</th>
              <th>Usage</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon: any) => (
              <tr key={coupon._id} className="border-t">
                <td className="p-4 font-bold">{coupon.code}</td>
                <td>{coupon.type === "percentage" ? "%" : "₹"}</td>
                <td>{coupon.value}</td>
                <td>₹{coupon.minOrderValue || 0}</td>
                <td>{coupon.usageCount || 0} / {coupon.usageLimit || "∞"}</td>
                <td>{coupon.active ? "Active" : "Inactive"}</td>
                <td><Link href={`/admin/coupons/${coupon._id}`} className="font-bold text-mutedgold">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
