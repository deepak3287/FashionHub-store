import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import { ProductCard } from "@/components/ProductCard";

async function getProducts() {
  await connectDB();
  const products = await Product.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1800&auto=format&fit=crop"
            alt="FashionHub premium fashion hero"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="premium-container relative grid min-h-[620px] items-center py-20 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-champagne/40 bg-champagne/10 px-4 py-2 text-sm text-champagne">
              New arrivals · Premium styles · Prepaid secure checkout
            </p>
            <h1 className="max-w-2xl text-5xl font-black leading-tight md:text-7xl">
              Luxury fashion for your everyday statement.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
              Discover curated clothing, footwear and accessories with a modern shopping experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-gold gap-2">
                Shop Collection <ArrowRight size={18} />
              </Link>
              <Link href="/shop?filter=new" className="btn-light">
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-container -mt-10 relative z-10 grid gap-4 md:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "Secure Prepaid", text: "COD disabled for a premium, safer checkout flow." },
          { icon: Truck, title: "Courier Tracking", text: "Tracking ID and courier links for every shipped order." },
          { icon: CreditCard, title: "Razorpay/Stripe", text: "Gateway-ready backend with secure key handling." }
        ].map((item) => (
          <div key={item.title} className="premium-card p-6">
            <item.icon className="text-mutedgold" />
            <h3 className="mt-4 font-black">{item.title}</h3>
            <p className="mt-2 text-sm text-black/60">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="premium-container py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-mutedgold">Curated categories</p>
            <h2 className="mt-2 text-3xl font-black">Shop by style</h2>
          </div>
          <Link href="/shop" className="hidden text-sm font-bold md:block">View all</Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {["Men", "Women", "Kids", "Footwear", "Accessories"].map((cat) => (
            <Link key={cat} href={`/shop?category=${cat}`} className="group premium-card overflow-hidden">
              <div className="relative aspect-square bg-softgray">
                <Image
                  src={`https://images.unsplash.com/photo-${cat === "Men" ? "1516257984-b1b4d707412e" : cat === "Women" ? "1483985988355-763728e1935b" : cat === "Kids" ? "1503919545889-aef636e10ad4" : cat === "Footwear" ? "1542291026-7eec264c27ff" : "1511499767150-a48a237f0083"}?q=80&w=700&auto=format&fit=crop`}
                  alt={cat}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-4 font-bold">{cat}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="premium-container py-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-semibold text-mutedgold">New drops</p>
            <h2 className="mt-2 text-3xl font-black">Featured products</h2>
          </div>
          <Link href="/shop" className="text-sm font-bold">Shop all</Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="premium-container py-16">
        <div className="premium-card overflow-hidden bg-ink p-8 text-white md:p-12">
          <div className="max-w-2xl">
            <p className="font-semibold text-champagne">Newsletter</p>
            <h2 className="mt-2 text-3xl font-black">Get early access to premium drops.</h2>
            <p className="mt-3 text-white/70">Join FashionHub updates for new arrivals and limited-time offers.</p>
            <form className="mt-6 flex max-w-lg gap-3">
              <input className="input text-ink" placeholder="Enter your email" />
              <button className="btn-gold">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
