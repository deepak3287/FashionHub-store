import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || ""
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dataUrl = body.dataUrl as string;
    if (!dataUrl) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Cloudinary accepts data URLs directly
    const res = await cloudinary.uploader.upload(dataUrl, { folder: "eor/products" });
    return NextResponse.json({ url: res.secure_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 400 });
  }
}
