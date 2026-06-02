"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminReviewTable({ reviews }: { reviews: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function deleteReview(id: string) {
    if (!confirm("Are you sure you want to permanently delete this review?")) {
      return;
    }

    setError("");
    setDeletingId(id);

    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Unable to delete review.");
      setDeletingId(null);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="premium-card mt-6 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-cream">
          <tr>
            <th className="p-4">Product ID</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Status</th>
            <th>Date</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id} className="border-t">
              <td className="p-4 font-mono text-xs">{review.productId}</td>
              <td>{"⭐".repeat(review.rating)}</td>
              <td className="max-w-xs truncate">{review.comment}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    review.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : review.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {review.status}
                </span>
              </td>
              <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/reviews/${review._id}`} className="font-bold text-mutedgold">
                    Edit
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === review._id}
                    onClick={() => deleteReview(review._id)}
                    className="btn-secondary"
                  >
                    {deletingId === review._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="p-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
