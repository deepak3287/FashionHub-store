import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import ReviewForm from "../review-form";

async function getReview(id: string) {
  await connectDB();
  const review = await Review.findById(id).lean();
  return JSON.parse(JSON.stringify(review));
}

export default async function EditReviewPage({ params }: { params: { id: string } }) {
  const review = await getReview(params.id);
  return <ReviewForm review={review} />;
}
