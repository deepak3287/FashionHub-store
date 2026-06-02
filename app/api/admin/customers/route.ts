import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { requireAdmin } from "../../_helpers";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;
  
  try {
    await connectDB();
    const customers = await User.find({ role: "customer" })
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ customers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to fetch customers" }, { status: 400 });
  }
}
