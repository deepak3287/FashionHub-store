"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function CategoryForm({ category }: { category?: any }) {
  const [form, setForm] = useState({
    name: category?.name || "",
    image: category?.image || "",
    subcategories: category?.subcategories?.join(", ") || "",
    active: category?.active ?? true
  });
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const body = {
      ...form,
      subcategories: form.subcategories.split(",").map((x: string) => x.trim()).filter(Boolean)
    };

    const res = await fetch(category ? `/api/admin/categories/${category._id}` : "/api/admin/categories", {
      method: category ? "PATCH" : "POST",
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Something went wrong");
    window.location.href = "/admin/categories";
  }

  return (
    <form onSubmit={submit} className="premium-card p-6">
      <h1 className="text-2xl font-black">{category ? "Edit Category" : "Add Category"}</h1>
      <div className="mt-6 grid gap-4">
        <input
          className="input"
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input"
          placeholder="Category image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        {form.image && (
          <div className="flex justify-center">
            <img src={form.image} alt="Category" className="h-32 w-32 rounded-lg object-cover" />
          </div>
        )}
        <input
          className="input"
          placeholder="Subcategories (comma separated)"
          value={form.subcategories}
          onChange={(e) => setForm({ ...form, subcategories: e.target.value })}
        />
        <label className="flex items-center gap-2 rounded-xl bg-cream px-4 py-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active
        </label>
      </div>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
      <button className="btn-primary mt-6">{category ? "Update Category" : "Create Category"}</button>
    </form>
  );
}
