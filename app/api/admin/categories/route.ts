import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models";
import { categorySchema } from "@/lib/validators";
import { slugify } from "@/lib/format";
import { requireAdmin } from "../../_helpers";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;
  await connectDB();
  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;
  try {
    await connectDB();
    const body = categorySchema.parse(await req.json());
    const category = await Category.create({ ...body, slug: body.slug || slugify(body.name) });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to create category" }, { status: 400 });
  }
}
