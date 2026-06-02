"use client";

import { useState } from "react";

const CATEGORY_SIZES: Record<string, string[]> = {
  "T-Shirts": ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  "Oversized T-Shirts": ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  Shirts: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  Hoodies: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  Jeans: ["28", "30", "32", "34", "36", "38", "40", "42"],
  Trousers: ["28", "30", "32", "34", "36", "38", "40"],
  "Cargo Pants": ["28", "30", "32", "34", "36", "38", "40"],
  Shorts: ["28", "30", "32", "34", "36", "38"],
  Jackets: ["S", "M", "L", "XL", "XXL", "3XL"],
  Sweatshirts: ["S", "M", "L", "XL", "XXL", "3XL"],
  Men: ["S", "M", "L", "XL"],
  Women: ["S", "M", "L", "XL"],
  Kids: ["XS", "S", "M", "L"]
};

export default function ProductForm({ product }: { product?: any }) {
  const [form, setForm] = useState(() => {
    return {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || "",
      salePrice: product?.salePrice || "",
      category: product?.category || "Women",
      subcategory: product?.subcategory || "",
      brand: product?.brand || "",
      fabric: product?.fabric || "",
      sku: product?.sku || "",
      stock: product?.stock || 0,
      images: product?.images || [],
      tags: product?.tags?.join(", ") || "",
      sizes: product?.sizes?.join(", ") || "",
      colors: product?.colors?.join(", ") || "",
      featured: product?.featured || false,
      trending: product?.trending || false,
      newArrival: product?.newArrival || false,
      active: product?.active ?? true,
      variants: product?.variants || []
    } as any;
  });

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const body: any = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      category: form.category,
      subcategory: form.subcategory,
      brand: form.brand,
      fabric: form.fabric,
      sku: form.sku,
      images: (form.images || []).filter(Boolean),
      tags: (form.tags || "").split(",").map((x: string) => x.trim()).filter(Boolean),
      sizes: (form.sizes || "").split(",").map((x: string) => x.trim()).filter(Boolean),
      colors: (form.colors || "").split(",").map((x: string) => x.trim()).filter(Boolean),
      featured: !!form.featured,
      trending: !!form.trending,
      newArrival: !!form.newArrival,
      active: !!form.active,
      variants: form.variants || []
    };

    try {
      const res = await fetch(product ? `/api/admin/products/${product._id}` : "/api/admin/products", {
        method: product ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data.error || "Something went wrong");
      window.location.href = "/admin/products";
    } catch (err: any) {
      setMessage(err.message || "Unable to save product");
    }
  }

  return (
    <form onSubmit={submit} className="premium-card p-6">
      <h1 className="text-2xl font-black">{product ? "Edit Product" : "Add Product"}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input className="input" placeholder="Product title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />

        <input className="input" placeholder="Subcategory" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
        <input className="input" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />

        <input className="input" placeholder="Fabric/material" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
        <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />

        <input className="input" type="number" placeholder="Sale price" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} />
        <div>
          <label className="text-sm font-bold">Category</label>
          <select className="input mt-2" value={form.category} onChange={(e) => {
            const cat = e.target.value;
            const sizes = CATEGORY_SIZES[cat] || [];
            setForm({ ...form, category: cat, sizes: sizes.join(", "), variants: sizes.map((s) => ({ size: s, stock: 0 })) });
          }}>
            {Object.keys(CATEGORY_SIZES).map((cat) => <option key={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold">Sizes & Stock</label>
          <div className="mt-2 grid gap-2">
            {(form.variants || []).map((v: any, idx: number) => (
              <div key={v.size + idx} className="flex items-center gap-2">
                <div className="w-24">{v.size}</div>
                <input className="input" type="number" min={0} value={v.stock} onChange={(e) => {
                  const next = [...(form.variants || [])];
                  next[idx] = { ...next[idx], stock: Number(e.target.value) };
                  setForm({ ...form, variants: next });
                }} />
              </div>
            ))}
          </div>
        </div>

        <input className="input" placeholder="Colors comma separated" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
        <input className="input" placeholder="Tags comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <textarea className="input md:col-span-2" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <div className="md:col-span-2">
          <label className="text-sm font-bold">Product Images</label>
          <div className="mt-2 flex flex-wrap gap-3">
            {(form.images || []).map((img: string, i: number) => (
              <div key={img} className="relative h-24 w-24 overflow-hidden rounded-xl bg-softgray">
                <img src={img} alt={`img-${i}`} className="object-cover w-full h-full" />
                <button type="button" onClick={() => setForm({ ...form, images: (form.images || []).filter((x: any) => x !== img) })} className="absolute top-1 right-1 rounded-full bg-white p-1 text-red-600">x</button>
              </div>
            ))}
            <label className="h-24 w-24 cursor-pointer rounded-xl border border-dashed p-2 text-center">
              <div className="mt-6 text-sm text-black/60">Upload</div>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                const reader = new FileReader();
                reader.onload = async () => {
                  const dataUrl = reader.result as string;
                  const res = await fetch('/api/admin/uploads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dataUrl }) });
                  const data = await res.json();
                  if (res.ok && data.url) {
                    setForm({ ...form, images: [...(form.images || []), data.url] });
                  } else {
                    setMessage(data.error || 'Upload failed');
                  }
                  setUploading(false);
                };
                reader.readAsDataURL(file);
              }} className="hidden" />
            </label>
          </div>
          {uploading && <p className="text-sm mt-2">Uploading...</p>}
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-4">
          {[
            ["featured", "Featured"],
            ["trending", "Trending"],
            ["newArrival", "New Arrival"],
            ["active", "Active"]
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-xl bg-cream px-4 py-3 text-sm font-semibold">
              <input type="checkbox" checked={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
              {label}
            </label>
          ))}
        </div>
      </div>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      <button className="btn-primary mt-6">{product ? "Update Product" : "Create Product"}</button>
    </form>
  );
}
