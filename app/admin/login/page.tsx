"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ ...form, adminOnly: true })
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Admin login failed");
    window.location.href = "/admin/dashboard";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-premium">
        <p className="text-sm font-semibold text-mutedgold">FashionHub owner access</p>
        <h1 className="mt-2 text-3xl font-black">Admin Login</h1>
        <p className="mt-2 text-sm text-black/60">Only the store owner/admin can access this dashboard.</p>
        <div className="mt-6 grid gap-4">
          <input className="input" placeholder="Admin email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-gold">Login to Dashboard</button>
        </div>
      </form>
    </main>
  );
}
