export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query: any = { active: true };

  if (searchParams.get("q")) query.$text = { $search: searchParams.get("q")! };
  if (searchParams.get("category")) query.category = searchParams.get("category");

  const products = await Product.find(query).sort({ createdAt: -1 }).limit(60).lean();
  return NextResponse.json({ products });
}
