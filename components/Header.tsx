import Link from "next/link";
import { ShoppingBag, Search, Heart, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-cream/95 backdrop-blur">
      <div className="premium-container flex h-20 items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight">
          Fashion<span className="text-mutedgold">Hub</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/shop" className="hover:text-mutedgold">Shop</Link>
          <Link href="/shop?category=Women" className="hover:text-mutedgold">Women</Link>
          <Link href="/shop?category=Men" className="hover:text-mutedgold">Men</Link>
          <Link href="/shop?category=Footwear" className="hover:text-mutedgold">Footwear</Link>
          <Link href="/about" className="hover:text-mutedgold">About</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/shop" className="rounded-full p-2 hover:bg-white">
            <Search size={20} />
          </Link>
          <Link href="/wishlist" className="hidden rounded-full p-2 hover:bg-white sm:block">
            <Heart size={20} />
          </Link>
          <Link href={user ? "/account" : "/login"} className="hidden rounded-full p-2 hover:bg-white sm:block">
            <User size={20} />
          </Link>
          <Link href="/cart" className="relative rounded-full bg-ink p-3 text-white">
            <ShoppingBag size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
