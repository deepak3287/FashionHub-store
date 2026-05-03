import Link from "next/link";
import {
  BarChart3,
  Boxes,
  CreditCard,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  Star,
  Image as ImageIcon
} from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tags },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/couriers", label: "Couriers", icon: Truck },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-ink p-5 text-white lg:block">
      <Link href="/" className="mb-8 flex items-center gap-2 text-2xl font-black">
        <Home className="text-champagne" /> Fashion<span className="text-champagne">Hub</span>
      </Link>
      <nav className="grid gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white">
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
