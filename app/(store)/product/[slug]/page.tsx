import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck, RotateCcw, Ruler } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/AddToCartButton";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";
import { formatCurrency } from "@/lib/format";

async function getProduct(slug: string) {
  await connectDB();
  const product = await Product.findOneAndUpdate(
    { slug, active: true },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();
  if (!product) return null;
  const related = await Product.find({
    active: true,
    category: (product as any).category,
    slug: { $ne: slug }
  }).limit(4).lean();
  return {
    product: JSON.parse(JSON.stringify(product)),
    related: JSON.parse(JSON.stringify(related))
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getProduct(params.slug);
  if (!data?.product) return {};
  return {
    title: data.product.title,
    description: data.product.description.slice(0, 155),
    openGraph: {
      images: data.product.images
    }
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProduct(params.slug);
  if (!data?.product) notFound();

  const product = data.product;
  const image = product.images?.[0];

  return (
    <main className="premium-container py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="grid gap-4 md:grid-cols-[100px_1fr]">
          <div className="hidden gap-3 md:grid">
            {product.images?.slice(0, 4).map((img: string) => (
              <div key={img} className="relative aspect-square overflow-hidden rounded-xl bg-softgray">
                <Image src={img} alt={product.title} fill className="object-cover" />
              </div>
            ))}
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-softgray shadow-premium">
            <Image src={image} alt={product.title} fill priority className="object-cover" />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-mutedgold">{product.brand || "FashionHub Premium"}</p>
          <h1 className="mt-2 text-4xl font-black">{product.title}</h1>
          <div className="mt-4 flex items-center gap-3">
            {product.salePrice && <span className="text-3xl font-black">{formatCurrency(product.salePrice)}</span>}
            <span className={product.salePrice ? "text-lg text-black/40 line-through" : "text-3xl font-black"}>
              {formatCurrency(product.price)}
            </span>
          </div>
          <p className="mt-5 leading-8 text-black/65">{product.description}</p>

          <div className="mt-6 grid gap-5">
            <div>
              <h3 className="font-bold">Size</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {(product.sizes || ["S", "M", "L", "XL"]).map((size: string) => (
                  <span key={size} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm">{size}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold">Color</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {(product.colors || ["Black"]).map((color: string) => (
                  <span key={color} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm">{color}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-4 text-sm">
            <b>{product.stock > 0 ? "In stock" : "Out of stock"}</b>
            <p className="mt-1 text-black/55">Delivery estimate: 3-7 business days after prepaid payment confirmation.</p>
          </div>

          <div className="mt-6 flex gap-3">
            <AddToCartButton
              disabled={product.stock === 0}
              item={{
                productId: product._id,
                title: product.title,
                slug: product.slug,
                image,
                price: product.price,
                salePrice: product.salePrice,
                quantity: 1,
                size: product.sizes?.[0],
                color: product.colors?.[0]
              }}
            />
            <Link href="/checkout" className="btn-gold w-full">Buy Now</Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Ruler, title: "Size chart" },
              { icon: Truck, title: "Tracked shipping" },
              { icon: RotateCcw, title: "Easy returns" }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-4">
                <item.icon className="text-mutedgold" />
                <p className="mt-2 text-sm font-bold">{item.title}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-black">Material & Care</h2>
            <p className="mt-2 text-black/60">{product.fabric || "Premium breathable fabric. Gentle wash recommended."}</p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-3xl font-black">Related products</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.related.map((item: any) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
