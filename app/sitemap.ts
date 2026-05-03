import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  await connectDB();
  const products = await Product.find({ active: true }).select("slug updatedAt").lean();

  return [
    { url: appUrl, lastModified: new Date() },
    { url: `${appUrl}/shop`, lastModified: new Date() },
    ...products.map((product: any) => ({
      url: `${appUrl}/product/${product.slug}`,
      lastModified: product.updatedAt
    }))
  ];
}
