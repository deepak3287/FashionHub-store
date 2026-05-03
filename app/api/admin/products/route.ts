import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import { productSchema } from "@/lib/validators";
import { slugify } from "@/lib/format";
import { requireAdmin } from "../../_helpers";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    const body = productSchema.parse(await req.json());
    const product = await Product.create({
      ...body,
      slug: body.slug || slugify(body.title)
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to create product" }, { status: 400 });
  }
}
