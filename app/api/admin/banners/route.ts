import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import { bannerSchema } from "@/lib/validators";
import { requireAdmin } from "../../_helpers";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;
  
  try {
    await connectDB();
    const banners = await Product.find({ isBanner: true }).sort({ createdAt: -1 }).limit(10).lean();
    return NextResponse.json({ banners });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to fetch banners" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    const body = bannerSchema.parse(await req.json());
    const banner = await Product.create({ ...body, isBanner: true });
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to create banner" }, { status: 400 });
  }
}
