import { Review } from "@/lib/models";
import { connectDB } from "@/lib/db";

type Props = {
  productId: string;
};

export default async function ReviewList({ productId }: Props) {
  await connectDB();
  const reviews = await Review.find({ productId, status: "approved" }).sort({ createdAt: -1 }).lean();

  if (!reviews.length) {
    return (
      <div className="premium-card p-6 mt-12">
        <h2 className="text-2xl font-black">Customer Reviews</h2>
        <p className="mt-3 text-sm text-black/70">Be the first to review this product.</p>
      </div>
    );
  }

  return (
    <div className="premium-card p-6 mt-12">
      <h2 className="text-2xl font-black">Customer Reviews</h2>
      <div className="mt-6 space-y-6">
        {reviews.map((review: any) => (
          <div key={review._id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold">{review.title || "Customer review"}</p>
                <p className="text-sm text-black/55">{review.verified ? "Verified purchase" : "Unverified"}</p>
              </div>
              <p className="font-semibold">{"⭐".repeat(review.rating)}</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-black/80">{review.comment}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-black/40">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
