"use client";

import { useState } from "react";

const statuses = [
  "payment_confirmed",
  "order_placed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "return_requested",
  "returned"
];

export default function OrderEditor({ order }: { order: any }) {
  const [form, setForm] = useState({
    status: order.status,
    courierPartner: order.courierPartner || "",
    trackingId: order.trackingId || "",
    trackingUrl: order.trackingUrl || ""
  });
  const [message, setMessage] = useState("");

  async function save() {
    const res = await fetch(`/api/admin/orders/${order._id}`, {
      method: "PATCH",
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMessage(res.ok ? "Order updated" : data.error || "Update failed");
  }

  return (
    <aside className="premium-card h-fit p-6">
      <h2 className="text-xl font-black">Update order</h2>
      <div className="mt-5 grid gap-4">
        <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
        <input className="input" placeholder="Courier partner" value={form.courierPartner} onChange={(e) => setForm({ ...form, courierPartner: e.target.value })} />
        <input className="input" placeholder="Tracking ID" value={form.trackingId} onChange={(e) => setForm({ ...form, trackingId: e.target.value })} />
        <input className="input" placeholder="Tracking URL" value={form.trackingUrl} onChange={(e) => setForm({ ...form, trackingUrl: e.target.value })} />
        <button onClick={save} className="btn-primary">Save</button>
        {message && <p className="text-sm text-black/60">{message}</p>}
      </div>
    </aside>
  );
}
