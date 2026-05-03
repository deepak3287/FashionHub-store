import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models";
import { formatCurrency } from "@/lib/format";

async function getOrders() {
  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(orders));
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-2xl font-black">Manage Orders</h1>
      <div className="premium-card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="p-4">Order</th>
              <th>Customer</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Total</th>
              <th>Tracking</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order._id} className="border-t">
                <td className="p-4 font-bold">{order.orderNumber}</td>
                <td>{order.customer?.name}<p className="text-xs text-black/50">{order.customer?.email}</p></td>
                <td>{order.paymentStatus}</td>
                <td>{order.status}</td>
                <td>{formatCurrency(order.total || 0)}</td>
                <td>{order.trackingId || "-"}</td>
                <td><Link href={`/admin/orders/${order._id}`} className="font-bold text-mutedgold">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
