import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import { bannerSchema } from "@/lib/validators";
import { requireAdmin } from "../../../_helpers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    const body = bannerSchema.partial().parse(await req.json());
    const banner = await Product.findByIdAndUpdate(params.id, { ...body, isBanner: true }, { new: true });
    return NextResponse.json({ banner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to update banner" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to delete banner" }, { status: 400 });
  }
}
