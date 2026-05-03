import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models";
import { requireAdmin } from "../../../_helpers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  await connectDB();
  const body = await req.json();

  const allowed = ["status", "courierPartner", "trackingId", "trackingUrl", "notes"];
  const update: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = body[key];
  }

  const order = await Order.findByIdAndUpdate(params.id, update, { new: true });
  return NextResponse.json({ order });
}
