import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  await connectDB();
  const product = await Product.findOne({ slug: params.slug, active: true }).lean();
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ product });
}
