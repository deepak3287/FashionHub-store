import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Truck,
  Package,
  Crown,
  LockKeyhole
} from "lucide-react";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getHomeProducts() {
  try {
    await connectDB();

    const featuredProducts = await Product.find({
      active: true,
      featured: true
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const newArrivals = await Product.find({
      active: true,
      newArrival: true
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    const trendingProducts = await Product.find({
      active: true,
      trending: true
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    return JSON.parse(
      JSON.stringify({
        featuredProducts,
        newArrivals,
        trendingProducts
      })
    );
  } catch (error) {
    console.error("Homepage product fetch error:", error);

    return {
      featuredProducts: [],
      newArrivals: [],
      trendingProducts: []
    };
  }
}

function EmptyProductSection({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="premium-card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream text-mutedgold">
        <Package size={30} />
      </div>

      <h3 className="mt-5 text-2xl font-black">{title}</h3>

      <p className="mt-3 max-w-xl text-sm leading-6 text-black/60">
        {description}
      </p>

      <Link href="/shop" className="btn-primary mt-6">
        Visit Shop
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const { featuredProducts, newArrivals, trendingProducts } =
    await getHomeProducts();

  const hasAnyProducts =
    featuredProducts.length > 0 ||
    newArrivals.length > 0 ||
    trendingProducts.length > 0;

  const categories = [
    {
      name: "Men",
      description: "Premium menswear collection",
      href: "/shop?category=Men"
    },
    {
      name: "Women",
      description: "Elegant fashion for women",
      href: "/shop?category=Women"
    },
    {
      name: "Kids",
      description: "Stylish kids fashion",
      href: "/shop?category=Kids"
    },
    {
      name: "Footwear",
      description: "Modern shoes and sneakers",
      href: "/shop?category=Footwear"
    },
    {
      name: "Accessories",
      description: "Bags, watches and more",
      href: "/shop?category=Accessories"
    }
  ];

  return (
    <main className="bg-cream">
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.30),transparent_35%),linear-gradient(135deg,#111111_0%,#1f1a13_45%,#000000_100%)]" />
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-champagne/10 blur-3xl" />
        </div>

        <div className="premium-container relative grid min-h-[700px] items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-4 py-2 text-sm font-semibold text-champagne">
              <Sparkles size={16} />
              Premium Fashion Ecommerce
            </p>

            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Build your own luxury fashion collection.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              FashionHub is your premium online fashion store. Add your own
              products from the admin dashboard and showcase only your real
              collection.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-gold gap-2">
                Explore Store <ArrowRight size={18} />
              </Link>

              <Link href="/admin/login" className="btn-light">
                Admin Login
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <Crown className="text-champagne" size={24} />
                <p className="mt-3 text-sm font-bold">Premium UI</p>
                <p className="mt-1 text-xs text-white/55">
                  Luxury fashion brand feel
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <LockKeyhole className="text-champagne" size={24} />
                <p className="mt-3 text-sm font-bold">Admin Controlled</p>
                <p className="mt-1 text-xs text-white/55">
                  Only owner can manage products
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <CreditCard className="text-champagne" size={24} />
                <p className="mt-3 text-sm font-bold">Prepaid Only</p>
                <p className="mt-1 text-xs text-white/55">
                  No COD checkout flow
                </p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="premium-card rotate-2 bg-white p-5">
              <div className="rounded-3xl bg-cream p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-mutedgold">
                      FashionHub
                    </p>
                    <h2 className="mt-1 text-3xl font-black text-ink">
                      Your Collection
                    </h2>
                  </div>

                  <div className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white">
                    LIVE
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-black/50">Products</p>
                    <p className="mt-2 text-3xl font-black text-ink">
                      {hasAnyProducts ? "Active" : "Empty"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-ink p-5 text-white">
                      <p className="text-sm text-white/55">Payment</p>
                      <p className="mt-2 font-black">Prepaid</p>
                    </div>

                    <div className="rounded-2xl bg-champagne p-5 text-ink">
                      <p className="text-sm text-black/55">Brand</p>
                      <p className="mt-2 font-black">Premium</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-black/20 bg-white/70 p-5 text-center">
                    <p className="text-sm font-semibold text-black/60">
                      Add your first real product from admin dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 rounded-3xl bg-champagne p-5 text-ink shadow-premium">
              <p className="text-sm font-semibold">Store Status</p>
              <p className="mt-1 text-2xl font-black">
                {hasAnyProducts ? "Ready" : "Setup Mode"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="premium-container relative z-10 -mt-12 grid gap-4 md:grid-cols-3">
        <div className="premium-card p-6">
          <ShieldCheck className="text-mutedgold" size={30} />
          <h3 className="mt-4 text-lg font-black">Secure Store</h3>
          <p className="mt-2 text-sm leading-6 text-black/60">
            Protected admin dashboard, secure backend APIs and safe checkout
            structure.
          </p>
        </div>

        <div className="premium-card p-6">
          <CreditCard className="text-mutedgold" size={30} />
          <h3 className="mt-4 text-lg font-black">Prepaid Payments</h3>
          <p className="mt-2 text-sm leading-6 text-black/60">
            COD is not shown anywhere. Razorpay and Stripe-ready payment flow.
          </p>
        </div>

        <div className="premium-card p-6">
          <Truck className="text-mutedgold" size={30} />
          <h3 className="mt-4 text-lg font-black">Courier Tracking</h3>
          <p className="mt-2 text-sm leading-6 text-black/60">
            Admin can add courier partner, tracking ID and tracking link for
            orders.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="premium-container py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-mutedgold">Shop by category</p>
            <h2 className="mt-2 text-4xl font-black">Fashion collections</h2>
            <p className="mt-3 max-w-2xl text-black/60">
              These are category entry points. Product cards will appear only
              when you add real products from the admin panel.
            </p>
          </div>

          <Link href="/shop" className="btn-primary">
            Open Shop
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group rounded-3xl border border-black/10 bg-white p-5 shadow-premium transition hover:-translate-y-1 hover:bg-ink hover:text-white"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-xl font-black text-mutedgold transition group-hover:bg-white/10 group-hover:text-champagne">
                {category.name.slice(0, 1)}
              </div>

              <h3 className="mt-5 text-xl font-black">{category.name}</h3>

              <p className="mt-2 text-sm leading-6 text-black/55 transition group-hover:text-white/60">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="premium-container py-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-mutedgold">Owner selected</p>
            <h2 className="mt-2 text-4xl font-black">Featured products</h2>
            <p className="mt-3 max-w-2xl text-black/60">
              Only products marked as featured by admin will appear here.
            </p>
          </div>

          <Link href="/shop" className="font-bold text-ink hover:text-mutedgold">
            View all products →
          </Link>
        </div>

        <div className="mt-8">
          {featuredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyProductSection
              title="No featured products yet"
              description="Your store is live, but no featured products are available right now. Add a product from the admin dashboard and mark it as featured to show it here."
            />
          )}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="premium-container py-12">
        <div className="rounded-3xl bg-ink p-6 text-white shadow-premium md:p-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-semibold text-champagne">Fresh collection</p>
              <h2 className="mt-2 text-4xl font-black">New arrivals</h2>
              <p className="mt-3 max-w-2xl text-white/65">
                Products will appear here only when admin marks them as new
                arrival.
              </p>
            </div>

            <Link href="/shop?filter=new" className="btn-gold">
              View New Arrivals
            </Link>
          </div>

          <div className="mt-8">
            {newArrivals.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {newArrivals.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                <Package className="mx-auto text-champagne" size={38} />
                <h3 className="mt-4 text-2xl font-black">
                  New arrivals coming soon
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/60">
                  Add your real products from admin dashboard and mark them as
                  new arrival. They will automatically appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="premium-container py-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-mutedgold">Popular picks</p>
            <h2 className="mt-2 text-4xl font-black">Trending now</h2>
            <p className="mt-3 max-w-2xl text-black/60">
              Only admin-marked trending products will appear in this section.
            </p>
          </div>
        </div>

        <div className="mt-8">
          {trendingProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {trendingProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyProductSection
              title="No trending products yet"
              description="No fake trending products are shown. Once you add your own products and mark them as trending, they will appear here automatically."
            />
          )}
        </div>
      </section>

      {/* OWNER CTA */}
      <section className="premium-container py-16">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-premium md:p-12">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-champagne/20 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="font-semibold text-mutedgold">Store owner panel</p>

            <h2 className="mt-2 text-4xl font-black">
              Add your own products, manage orders and grow FashionHub.
            </h2>

            <p className="mt-4 leading-8 text-black/65">
              This homepage does not depend on dummy products. Your real product
              listings, pricing, images, stock, courier tracking and orders are
              controlled from the admin dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/admin/login" className="btn-primary">
                Go to Admin Dashboard
              </Link>

              <Link href="/shop" className="btn-light">
                View Customer Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="premium-container pb-16">
        <div className="rounded-3xl bg-ink p-8 text-white shadow-premium md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <p className="font-semibold text-champagne">FashionHub updates</p>

              <h2 className="mt-2 text-4xl font-black">
                Build a premium customer list.
              </h2>

              <p className="mt-4 leading-8 text-white/65">
                Newsletter section is ready for future email integration. You
                can connect Resend, SendGrid or SMTP later.
              </p>
            </div>

            <form className="flex flex-col gap-3 rounded-2xl bg-white/5 p-4 sm:flex-row">
              <input
                className="input text-ink"
                placeholder="Enter customer email"
              />
              <button type="button" className="btn-gold">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}