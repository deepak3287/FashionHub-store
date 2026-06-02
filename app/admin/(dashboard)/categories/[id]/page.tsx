import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models";
import CategoryForm from "../category-form";

async function getCategory(id: string) {
  await connectDB();
  const category = await Category.findById(id).lean();
  return JSON.parse(JSON.stringify(category));
}

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategory(params.id);
  return <CategoryForm category={category} />;
}
