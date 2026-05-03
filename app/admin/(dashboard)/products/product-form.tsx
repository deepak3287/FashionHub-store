"use client";

import { useState } from "react";

export default function ProductForm({ product }: { product?: any }) {
  const [form, setForm] = useState({
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
    images: product?.images?.join("\n") || "",
    tags: product?.tags?.join(", ") || "",
    sizes: product?.sizes?.join(", ") || "",
    colors: product?.colors?.join(", ") || "",
    featured: product?.featured || false,
    trending: product?.trending || false,
    newArrival: product?.newArrival || false,
    active: product?.active ?? true
  });
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const body = {
      ...form,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      stock: Number(form.stock),
      images: form.images.split("\n").map((x: string) => x.trim()).filter(Boolean),
      tags: form.tags.split(",").map((x: string) => x.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((x: string) => x.trim()).filter(Boolean),
      colors: form.colors.split(",").map((x: string) => x.trim()).filter(Boolean)
    };

    const res = await fetch(product ? `/api/admin/products/${product._id}` : "/api/admin/products", {
      method: product ? "PATCH" : "POST",
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Something went wrong");
    window.location.href = "/admin/products";
  }

  return (
    <form onSubmit={submit} className="premium-card p-6">
      <h1 className="text-2xl font-black">{product ? "Edit Product" : "Add Product"}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input className="input" placeholder="Product title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="input" type="number" placeholder="Sale price" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {["Men", "Women", "Kids", "Footwear", "Accessories"].map((cat) => <option key={cat}>{cat}</option>)}
        </select>
        <input className="input" placeholder="Subcategory" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
        <input className="input" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <input className="input" placeholder="Fabric/material" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
        <input className="input" type="number" placeholder="Stock quantity" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input className="input" placeholder="Sizes comma separated" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
        <input className="input" placeholder="Colors comma separated" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
        <input className="input" placeholder="Tags comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <textarea className="input md:col-span-2" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <textarea className="input md:col-span-2" rows={4} placeholder="Image URLs, one per line" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />

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
