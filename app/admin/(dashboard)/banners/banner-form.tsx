"use client";

import { useState } from "react";

export default function BannerForm({ banner }: { banner?: any }) {
  const [form, setForm] = useState({
    title: banner?.title || "",
    description: banner?.description || "",
    images: banner?.images?.[0] || "",
    link: banner?.link || "",
    position: banner?.position || "hero",
    active: banner?.active ?? true,
    startDate: banner?.startDate || "",
    endDate: banner?.endDate || ""
  });
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const body = {
      ...form,
      images: [form.images]
    };

    const res = await fetch(banner ? `/api/admin/banners/${banner._id}` : "/api/admin/banners", {
      method: banner ? "PATCH" : "POST",
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Something went wrong");
    window.location.href = "/admin/banners";
  }

  return (
    <form onSubmit={submit} className="premium-card p-6">
      <h1 className="text-2xl font-black">{banner ? "Edit Banner" : "Add Banner"}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Banner title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <select
          className="input"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        >
          <option value="hero">Hero (Main)</option>
          <option value="secondary">Secondary</option>
          <option value="sidebar">Sidebar</option>
        </select>
        <input
          className="input md:col-span-2"
          placeholder="Banner image URL"
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
          required
        />
        {form.images && (
          <div className="md:col-span-2 flex justify-center">
            <img src={form.images} alt="Banner" className="h-40 max-w-xl rounded-lg object-cover" />
          </div>
        )}
        <input
          className="input md:col-span-2"
          placeholder="Link URL"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />
        <input
          className="input"
          type="datetime-local"
          placeholder="Start date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <input
          className="input"
          type="datetime-local"
          placeholder="End date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
        <textarea
          className="input md:col-span-2"
          rows={3}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
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
      <button className="btn-primary mt-6">{banner ? "Update Banner" : "Create Banner"}</button>
    </form>
  );
}
