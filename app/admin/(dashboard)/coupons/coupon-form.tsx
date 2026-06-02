"use client";

import { useState } from "react";

export default function CouponForm({ coupon }: { coupon?: any }) {
  const [form, setForm] = useState({
    code: coupon?.code || "",
    type: coupon?.type || "percentage",
    value: coupon?.value || "",
    minOrderValue: coupon?.minOrderValue || "",
    maxDiscount: coupon?.maxDiscount || "",
    usageLimit: coupon?.usageLimit || "",
    expiresAt: coupon?.expiresAt || "",
    description: coupon?.description || "",
    active: coupon?.active ?? true
  });
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const body = {
      ...form,
      value: Number(form.value),
      minOrderValue: Number(form.minOrderValue) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      expiresAt: form.expiresAt || undefined
    };

    const res = await fetch(coupon ? `/api/admin/coupons/${coupon._id}` : "/api/admin/coupons", {
      method: coupon ? "PATCH" : "POST",
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Something went wrong");
    window.location.href = "/admin/coupons";
  }

  return (
    <form onSubmit={submit} className="premium-card p-6">
      <h1 className="text-2xl font-black">{coupon ? "Edit Coupon" : "Add Coupon"}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Coupon code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          required
        />
        <select
          className="input"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount</option>
        </select>
        <input
          className="input"
          type="number"
          placeholder={form.type === "percentage" ? "Discount %" : "Discount Amount"}
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          required
        />
        <input
          className="input"
          type="number"
          placeholder="Min order value (₹)"
          value={form.minOrderValue}
          onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
        />
        <input
          className="input"
          type="number"
          placeholder="Max discount (₹)"
          value={form.maxDiscount}
          onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
        />
        <input
          className="input"
          type="number"
          placeholder="Usage limit"
          value={form.usageLimit}
          onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
        />
        <input
          className="input"
          type="datetime-local"
          placeholder="Expires at"
          value={form.expiresAt}
          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
        />
        <textarea
          className="input md:col-span-2"
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label className="flex items-center gap-2 rounded-xl bg-cream px-4 py-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active
        </label>
      </div>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      <button className="btn-primary mt-6">{coupon ? "Update Coupon" : "Create Coupon"}</button>
    </form>
  );
}
