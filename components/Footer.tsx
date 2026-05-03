import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="premium-container grid gap-10 py-14 md:grid-cols-4">
        <div>
          <h3 className="text-2xl font-black">Fashion<span className="text-champagne">Hub</span></h3>
          <p className="mt-4 text-sm leading-6 text-white/70">
            Premium prepaid-only fashion ecommerce experience for modern shoppers.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Shop</h4>
          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <Link href="/shop">All Products</Link>
            <Link href="/shop?filter=new">New Arrivals</Link>
            <Link href="/shop?filter=trending">Trending</Link>
            <Link href="/shop?filter=bestseller">Best Sellers</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Support</h4>
          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <Link href="/contact">Contact</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
            <Link href="/return-policy">Return Policy</Link>
            <Link href="/order-tracking">Order Tracking</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} FashionHub. All rights reserved.
      </div>
    </footer>
  );
}
