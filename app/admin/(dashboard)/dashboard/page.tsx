import { DollarSign, Package, ShoppingCart, Users, AlertTriangle, Truck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { connectDB } from "@/lib/db";
import { Order, Product, User } from "@/lib/models";
import { formatCurrency } from "@/lib/format";

async function getStats() {
  await connectDB();
  const [orders, customers, products, lowStock, recentOrders] = await Promise.all([
    Order.find({}).sort({ createdAt: -1 }).limit(200).lean(),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments({}),
    Product.countDocuments({ stock: { $lte: 5 } }),
    Order.find({}).sort({ createdAt: -1 }).limit(8).lean()
  ]);

  const revenue = orders.filter((o: any) => o.paymentStatus === "paid").reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  return {
    totalOrders: orders.length,
    customers,
    products,
    lowStock,
    revenue,
    pending: orders.filter((o: any) => ["payment_confirmed", "order_placed", "packed"].includes(o.status)).length,
    shipped: orders.filter((o: any) => o.status === "shipped").length,
    delivered: orders.filter((o: any) => o.status === "delivered").length,
    recentOrders: JSON.parse(JSON.stringify(recentOrders))
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats.revenue)} icon={DollarSign} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
        <StatCard title="Total Customers" value={stats.customers} icon={Users} />
        <StatCard title="Products" value={stats.products} icon={Package} />
        <StatCard title="Pending Orders" value={stats.pending} icon={AlertTriangle} />
        <StatCard title="Shipped Orders" value={stats.shipped} icon={Truck} />
        <StatCard title="Delivered Orders" value={stats.delivered} icon={ShoppingCart} />
        <StatCard title="Low Stock Products" value={stats.lowStock} icon={AlertTriangle} />
      </div>

      <div className="mt-8 premium-card p-6">
        <h2 className="text-xl font-black">Recent orders</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3">Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: any) => (
                <tr key={order._id} className="border-b last:border-0">
                  <td className="py-3 font-bold">{order.orderNumber}</td>
                  <td>{order.customer?.name}</td>
                  <td>{order.status}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{formatCurrency(order.total || 0)}</td>
                </tr>
              ))}
              {!stats.recentOrders.length && (
                <tr><td className="py-6 text-black/50" colSpan={5}>No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
