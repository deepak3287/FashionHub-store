import { ProductCard } from "@/components/ProductCard";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models";

type Props = {
  searchParams: {
    q?: string;
    category?: string;
    sort?: string;
    min?: string;
    max?: string;
    filter?: string;
  };
};

async function getProducts(searchParams: Props["searchParams"]) {
  await connectDB();

  const query: any = { active: true };

  if (searchParams.category) query.category = searchParams.category;
  if (searchParams.q) query.$text = { $search: searchParams.q };
  if (searchParams.min || searchParams.max) {
    query.salePrice = {
      ...(searchParams.min ? { $gte: Number(searchParams.min) } : {}),
      ...(searchParams.max ? { $lte: Number(searchParams.max) } : {})
    };
  }
  if (searchParams.filter === "new") query.newArrival = true;
  if (searchParams.filter === "trending") query.trending = true;

  const sort: any =
    searchParams.sort === "price-low" ? { salePrice: 1, price: 1 } :
    searchParams.sort === "price-high" ? { salePrice: -1, price: -1 } :
    searchParams.sort === "popular" ? { sold: -1, views: -1 } :
    { createdAt: -1 };

  const products = await Product.find(query).sort(sort).limit(48).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function ShopPage({ searchParams }: Props) {
  const products = await getProducts(searchParams);

  return (
    <main className="premium-container py-10">
      <div className="rounded-3xl bg-ink p-8 text-white">
        <p className="text-champagne">FashionHub collection</p>
        <h1 className="mt-2 text-4xl font-black">Shop premium fashion</h1>
        <p className="mt-3 text-white/70">Search, filter and discover your next outfit.</p>
      </div>

      <form className="mt-8 grid gap-3 premium-card p-4 md:grid-cols-[1fr_180px_180px_160px]">
        <input name="q" defaultValue={searchParams.q} placeholder="Search products..." className="input" />
        <select name="category" defaultValue={searchParams.category || ""} className="input">
          <option value="">All categories</option>
          {["Men", "Women", "Kids", "Footwear", "Accessories"].map((cat) => <option key={cat}>{cat}</option>)}
        </select>
        <select name="sort" defaultValue={searchParams.sort || ""} className="input">
          <option value="">Newest</option>
          <option value="price-low">Price low to high</option>
          <option value="price-high">Price high to low</option>
          <option value="popular">Popularity</option>
        </select>
        <button className="btn-primary">Apply</button>
      </form>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {!products.length && (
        <div className="premium-card mt-8 p-10 text-center">
          <h2 className="text-2xl font-black">No products found</h2>
          <p className="mt-2 text-black/60">Try a different search or filter.</p>
        </div>
      )}
    </main>
  );
}
