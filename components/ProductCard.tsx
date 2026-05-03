import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { formatCurrency } from "@/lib/format";

type Props = {
  product: {
    title: string;
    slug: string;
    price: number;
    salePrice?: number;
    images: string[];
    rating?: number;
    reviewCount?: number;
    stock?: number;
  };
};

export function ProductCard({ product }: Props) {
  const image =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop";

  const hasDiscount =
    product.salePrice && product.salePrice > 0 && product.salePrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-premium transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,0.16)]">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-softgray"
      >
        <Image
          src={image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-champagne px-3 py-1 text-xs font-black text-ink shadow">
            {discountPercent}% OFF
          </span>
        )}

        {product.stock === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white shadow">
            Out of stock
          </span>
        )}

        <button
          type="button"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow transition hover:scale-110 hover:text-red-500"
          aria-label="Add to wishlist"
        >
          <Heart size={18} />
        </button>

        <div className="absolute bottom-4 left-4 right-4 translate-y-6 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-ink shadow">
            <ShoppingBag size={17} />
            Quick View
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-mutedgold">
            FashionHub
          </span>

          <div className="flex items-center gap-1 text-xs font-bold text-mutedgold">
            <Star size={14} fill="currentColor" />
            {product.rating || 4.7}
          </div>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="mt-4 block line-clamp-2 min-h-[48px] text-lg font-black leading-6 transition hover:text-mutedgold"
        >
          {product.title}
        </Link>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Price
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-xl font-black text-ink">
                    {formatCurrency(product.salePrice!)}
                  </span>
                  <span className="text-sm font-semibold text-black/35 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-black text-ink">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white transition hover:scale-110 hover:bg-champagne hover:text-ink"
            aria-label="View product"
          >
            <ShoppingBag size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}