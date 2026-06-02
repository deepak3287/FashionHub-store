import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { StoreSetting } from "@/lib/models";
import { storeSettingSchema } from "@/lib/validators";
import { requireAdmin } from "../../_helpers";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;
  
  try {
    await connectDB();
    let setting = await StoreSetting.findOne({});
    if (!setting) {
      setting = await StoreSetting.create({
        storeName: "EOR",
        currency: "INR",
        freeShippingAbove: 1999
      });
    }
    return NextResponse.json({ setting });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to fetch settings" }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.response) return guard.response;

  try {
    await connectDB();
    const body = storeSettingSchema.parse(await req.json());
    let setting = await StoreSetting.findOne({});
    
    if (setting) {
      setting = await StoreSetting.findByIdAndUpdate(setting._id, body, { new: true });
    } else {
      setting = await StoreSetting.create(body);
    }
    
    return NextResponse.json({ setting });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to save settings" }, { status: 400 });
  }
}
