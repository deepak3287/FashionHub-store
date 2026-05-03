"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Registration failed");
    window.location.href = "/account";
  }

  return (
    <main className="premium-container py-16">
      <form onSubmit={submit} className="premium-card mx-auto max-w-md p-8">
        <h1 className="text-3xl font-black">Create account</h1>
        <p className="mt-2 text-sm text-black/60">Start shopping premium fashion.</p>
        <div className="mt-6 grid gap-4">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary">Register</button>
        </div>
        <p className="mt-5 text-sm">Already have account? <Link href="/login" className="font-bold text-mutedgold">Login</Link></p>
      </form>
    </main>
  );
}
