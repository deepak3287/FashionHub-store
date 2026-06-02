import Link from "next/link";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";

async function getCustomers() {
  await connectDB();
  const customers = await User.find({ role: "customer" })
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(customers));
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Manage Customers</h1>
      </div>

      <div className="premium-card mt-6 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream">
            <tr>
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: any) => (
              <tr key={customer._id} className="border-t">
                <td className="p-4 font-bold">{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone || "—"}</td>
                <td>{customer.blocked ? "Blocked" : "Active"}</td>
                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                <td><Link href={`/admin/customers/${customer._id}`} className="font-bold text-mutedgold">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
