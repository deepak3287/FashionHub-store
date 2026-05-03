import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import { productSchema } from "@/lib/validators";
import { slugify } from "@/lib/format";
import { requireAdmin } from "../../../_helpers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    const body = productSchema.partial().parse(await req.json());
    const update: any = { ...body };
    if (body.title && !body.slug) update.slug = slugify(body.title);

    const product = await Product.findByIdAndUpdate(params.id, update, { new: true });
    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to update product" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
