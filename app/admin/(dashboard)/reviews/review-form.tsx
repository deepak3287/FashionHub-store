"use client";

import { useState } from "react";

export default function ReviewForm({ review }: { review?: any }) {
  const [form, setForm] = useState({
    rating: review?.rating || 5,
    title: review?.title || "",
    comment: review?.comment || "",
    status: review?.status || "pending",
    verified: review?.verified || false
  });
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const body = {
      ...form,
      rating: Number(form.rating)
    };

    const res = await fetch(review ? `/api/admin/reviews/${review._id}` : "/api/admin/reviews", {
      method: review ? "PATCH" : "POST",
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Something went wrong");
    window.location.href = "/admin/reviews";
  }

  return (
    <form onSubmit={submit} className="premium-card p-6">
      <h1 className="text-2xl font-black">Review Details</h1>
      <div className="mt-6 grid gap-4">
        <div>
          <label className="text-sm font-bold">Rating</label>
          <select
            className="input"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} {"⭐".repeat(r)}</option>
            ))}
          </select>
        </div>
        <input
          className="input"
          placeholder="Review title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="input"
          rows={4}
          placeholder="Review comment"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          required
        />
        <select
          className="input"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <label className="flex items-center gap-2 rounded-xl bg-cream px-4 py-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.verified}
            onChange={(e) => setForm({ ...form, verified: e.target.checked })}
          />
          Verified Purchase
        </label>
      </div>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      <button className="btn-primary mt-6">Update Review</button>
    </form>
  );
}
