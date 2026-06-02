import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User, Order } from "@/lib/models";
import { requireAdmin } from "../../../_helpers";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    const user = await User.findById(params.id).select("-passwordHash").lean();
    const orders = await Order.find({ customer: params.id }).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ user, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to fetch customer" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    const { blocked } = await req.json();
    const user = await User.findByIdAndUpdate(params.id, { blocked }, { new: true });
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to update customer" }, { status: 400 });
  }
}
