import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";

async function getBanners() {
  await connectDB();
  const banners = await Product.find({ isBanner: true }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(banners));
}

export default async function AdminBannersPage() {
  const banners = await getBanners();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Manage Banners</h1>
        <Link href="/admin/banners/new" className="btn-primary">Add Banner</Link>
      </div>

      <div className="premium-card mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="p-4">Title</th>
              <th>Position</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner: any) => (
              <tr key={banner._id} className="border-t">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={banner.images?.[0]} alt={banner.title} className="h-12 w-16 rounded object-cover" />
                    <b>{banner.title}</b>
                  </div>
                </td>
                <td>{banner.position || "hero"}</td>
                <td>{banner.active ? "Active" : "Inactive"}</td>
                <td>{new Date(banner.createdAt).toLocaleDateString()}</td>
                <td><Link href={`/admin/banners/${banner._id}`} className="font-bold text-mutedgold">Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
