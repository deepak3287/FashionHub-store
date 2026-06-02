import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models";
import { reviewSchema } from "@/lib/validators";
import { requireAdmin } from "../../../_helpers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    const body = reviewSchema.partial().parse(await req.json());
    const review = await Review.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to update review" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    await Review.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to delete review" }, { status: 400 });
  }
}
