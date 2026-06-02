import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import BannerForm from "../banner-form";

async function getBanner(id: string) {
  await connectDB();
  const banner = await Product.findById(id).lean();
  return JSON.parse(JSON.stringify(banner));
}

export default async function EditBannerPage({ params }: { params: { id: string } }) {
  const banner = await getBanner(params.id);
  return <BannerForm banner={banner} />;
}
