import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models";
import { categorySchema } from "@/lib/validators";
import { slugify } from "@/lib/format";
import { requireAdmin } from "../../../_helpers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    const body = categorySchema.partial().parse(await req.json());
    const update: any = { ...body };
    if (body.name && !body.slug) update.slug = slugify(body.name);

    const category = await Category.findByIdAndUpdate(params.id, update, { new: true });
    return NextResponse.json({ category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to update category" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    await Category.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to delete category" }, { status: 400 });
  }
}
