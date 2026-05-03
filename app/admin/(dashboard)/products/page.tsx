import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import { formatCurrency } from "@/lib/format";

async function getProducts() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Manage Products</h1>
        <Link href="/admin/products/new" className="btn-primary">Add Product</Link>
      </div>

      <div className="premium-card mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="p-4">Product</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product._id} className="border-t">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={product.images?.[0]} alt={product.title} className="h-14 w-12 rounded-lg object-cover" />
                    <div>
                      <b>{product.title}</b>
                      <p className="text-xs text-black/50">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>{formatCurrency(product.salePrice || product.price)}</td>
                <td>{product.active ? "Active" : "Inactive"}</td>
                <td><Link href={`/admin/products/${product._id}`} className="font-bold text-mutedgold">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
