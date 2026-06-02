import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models";

async function getCategories() {
  await connectDB();
  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(categories));
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Manage Categories</h1>
        <Link href="/admin/categories/new" className="btn-primary">Add Category</Link>
      </div>

      <div className="premium-card mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="p-4">Category</th>
              <th>Subcategories</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category: any) => (
              <tr key={category._id} className="border-t">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {category.image && <img src={category.image} alt={category.name} className="h-12 w-12 rounded-lg object-cover" />}
                    <b>{category.name}</b>
                  </div>
                </td>
                <td>{category.subcategories?.join(", ") || "—"}</td>
                <td>{category.active ? "Active" : "Inactive"}</td>
                <td><Link href={`/admin/categories/${category._id}`} className="font-bold text-mutedgold">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
