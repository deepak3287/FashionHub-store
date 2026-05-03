import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
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
  const image = product.images?.[0] || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop";

  return (
    <div className="group premium-card overflow-hidden">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-softgray">
        <Image
          src={image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {product.stock === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
        <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow">
          <Heart size={17} />
        </button>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/product/${product.slug}`} className="font-semibold leading-tight hover:text-mutedgold">
            {product.title}
          </Link>
          <div className="flex items-center gap-1 text-xs text-mutedgold">
            <Star size={14} fill="currentColor" /> {product.rating || 4.7}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="font-bold">{formatCurrency(product.salePrice)}</span>
              <span className="text-sm text-black/45 line-through">{formatCurrency(product.price)}</span>
            </>
          ) : (
            <span className="font-bold">{formatCurrency(product.price)}</span>
          )}
        </div>
        <Link href={`/product/${product.slug}`} className="mt-4 flex w-full justify-center rounded-xl border border-black/10 py-2 text-sm font-semibold transition hover:bg-ink hover:text-white">
          Quick View
        </Link>
      </div>
    </div>
  );
}
