import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import ProductForm from "../product-form";

async function getProduct(id: string) {
  await connectDB();
  const product = await Product.findById(id).lean();
  return JSON.parse(JSON.stringify(product));
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <ProductForm product={product} />;
}
