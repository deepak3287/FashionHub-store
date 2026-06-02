"use client";

import { useState } from "react";

export default function ReviewSubmissionForm({ productId }: { productId: string }) {
  const [form, setForm] = useState({ rating: 5, title: "", comment: "" });
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setSubmitted(false);

    if (!form.comment.trim() || form.comment.trim().length < 10) {
      return setMessage("Please enter at least 10 characters for your review comment.");
    }

    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId,
        rating: form.rating,
        title: form.title.trim(),
        comment: form.comment.trim()
      })
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      return setMessage(data.error || "Unable to submit your review. Please try again.");
    }

    setSubmitted(true);
    setForm({ rating: 5, title: "", comment: "" });
    setMessage("Your review has been submitted and is pending approval.");
  }

  return (
    <div className="premium-card p-6 mt-12">
      <h2 className="text-2xl font-black">Share your review</h2>
      <p className="mt-2 text-sm text-black/70">Submit feedback for this product; reviews are moderated by admin before publishing.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div>
          <label className="text-sm font-bold">Rating</label>
          <select
            className="input mt-2"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} {"⭐".repeat(rating)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold">Title</label>
          <input
            className="input mt-2"
            placeholder="Summary of your review"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-bold">Comment</label>
          <textarea
            className="input mt-2"
            rows={5}
            placeholder="Tell others what you liked or what could be better"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            required
          />
        </div>

        {message && (
          <p className={`text-sm ${submitted ? "text-green-600" : "text-red-600"}`}>{message}</p>
        )}

        <button className="btn-primary mt-2" type="submit" disabled={loading}>
          {loading ? "Submitting..." : submitted ? "Submitted" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
