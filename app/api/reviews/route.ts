import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { reviewSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const productId = req.nextUrl.searchParams.get("productId");
    const filter: Record<string, any> = { status: "approved" };
    if (productId) filter.productId = productId;
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ reviews: JSON.parse(JSON.stringify(reviews)) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to fetch reviews" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = reviewSchema.parse({
      productId: body.productId,
      rating: Number(body.rating),
      title: body.title?.trim(),
      comment: body.comment?.trim(),
      verified: false,
      status: "pending"
    });
    const review = await Review.create(parsed);
    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to submit review" }, { status: 400 });
  }
}
