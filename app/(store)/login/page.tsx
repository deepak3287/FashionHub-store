"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Login failed");
    window.location.href = data.user.role === "admin" ? "/admin/dashboard" : "/account";
  }

  return (
    <main className="premium-container py-16">
      <form onSubmit={submit} className="premium-card mx-auto max-w-md p-8">
        <h1 className="text-3xl font-black">Login</h1>
        <p className="mt-2 text-sm text-black/60">Access your FashionHub account.</p>
        <div className="mt-6 grid gap-4">
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary">Login</button>
        </div>
        <p className="mt-5 text-sm">New here? <Link href="/register" className="font-bold text-mutedgold">Create account</Link></p>
      </form>
    </main>
  );
}
