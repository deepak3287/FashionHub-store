"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/customers/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setCustomer(data.user);
        setOrders(data.orders);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function toggleBlock() {
    const res = await fetch(`/api/admin/customers/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify({ blocked: !customer?.blocked })
    });
    const data = await res.json();
    if (res.ok) {
      setCustomer(data.user);
      setMessage(`Customer ${data.user.blocked ? "blocked" : "unblocked"}`);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Customer Details</h1>
        <Link href="/admin/customers" className="text-mutedgold font-bold">← Back</Link>
      </div>

      <div className="premium-card p-6">
        <h2 className="text-xl font-black">Profile Information</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-black/60">Name</p>
            <p className="font-bold">{customer.name}</p>
          </div>
          <div>
            <p className="text-xs text-black/60">Email</p>
            <p className="font-bold">{customer.email}</p>
          </div>
          <div>
            <p className="text-xs text-black/60">Phone</p>
            <p className="font-bold">{customer.phone || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-black/60">Status</p>
            <p className="font-bold">{customer.blocked ? "🚫 Blocked" : "✅ Active"}</p>
          </div>
          <div>
            <p className="text-xs text-black/60">Joined</p>
            <p className="font-bold">{new Date(customer.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        <button onClick={toggleBlock} className={`mt-6 ${customer.blocked ? "btn-primary" : "bg-red-600 text-white px-4 py-2 rounded-lg font-bold"}`}>
          {customer.blocked ? "Unblock Customer" : "Block Customer"}
        </button>
      </div>

      <div className="premium-card p-6">
        <h2 className="text-xl font-black">Order History ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-black/60">No orders yet</p>
        ) : (
          <div className="mt-4 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order._id} className="border-t">
                    <td className="p-3 font-mono text-xs">{order.orderNumber}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>₹{order.total || 0}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
