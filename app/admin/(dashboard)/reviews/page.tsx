import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import AdminReviewTable from "./review-table";

async function getReviews() {
  await connectDB();
  const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(reviews));
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Manage Reviews</h1>
      </div>

      <AdminReviewTable reviews={reviews} />
    </div>
  );
}
