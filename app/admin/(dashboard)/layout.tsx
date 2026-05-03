import { AdminSidebar } from "@/components/AdminSidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-softgray">
      <AdminSidebar />
      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-5 lg:px-8">
            <div>
              <p className="text-sm text-black/50">Admin Panel</p>
              <h1 className="font-black">FashionHub Dashboard</h1>
            </div>
            <div className="text-right text-sm">
              <p className="font-bold">{user?.name}</p>
              <p className="text-black/50">{user?.email}</p>
            </div>
          </div>
        </header>
        <div className="p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
