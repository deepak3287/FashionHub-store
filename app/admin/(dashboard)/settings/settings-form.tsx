"use client";

import { useEffect, useState } from "react";

export default function SettingsForm() {
  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    logo: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    gstNumber: "",
    currency: "INR",
    taxPercentage: 0,
    shippingCharge: 0,
    freeShippingAbove: 1999,
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.setting) {
        const s = data.setting;
        setForm({
          storeName: s.storeName || "",
          storeDescription: s.storeDescription || "",
          logo: s.logo || "",
          contactEmail: s.contactEmail || "",
          contactPhone: s.contactPhone || "",
          address: s.address || "",
          city: s.city || "",
          state: s.state || "",
          country: s.country || "",
          pincode: s.pincode || "",
          gstNumber: s.gstNumber || "",
          currency: s.currency || "INR",
          taxPercentage: s.taxPercentage || 0,
          shippingCharge: s.shippingCharge || 0,
          freeShippingAbove: s.freeShippingAbove || 1999,
          facebook: s.socialLinks?.facebook || "",
          instagram: s.socialLinks?.instagram || "",
          twitter: s.socialLinks?.twitter || "",
          linkedin: s.socialLinks?.linkedin || ""
        });
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const body = {
      ...form,
      taxPercentage: Number(form.taxPercentage),
      shippingCharge: Number(form.shippingCharge),
      freeShippingAbove: Number(form.freeShippingAbove),
      socialLinks: {
        facebook: form.facebook,
        instagram: form.instagram,
        twitter: form.twitter,
        linkedin: form.linkedin
      }
    };

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Something went wrong");
    setMessage("Settings saved successfully!");
  }

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={submit} className="premium-card p-6 max-w-4xl">
      <h1 className="text-2xl font-black">Store Settings</h1>

      <h2 className="text-xl font-black mt-8 mb-4">Basic Information</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Store name"
          value={form.storeName}
          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
        />
        <input
          className="input"
          placeholder="Logo URL"
          value={form.logo}
          onChange={(e) => setForm({ ...form, logo: e.target.value })}
        />
        {form.logo && (
          <div className="md:col-span-2">
            <img src={form.logo} alt="Logo" className="h-12 rounded" />
          </div>
        )}
        <textarea
          className="input md:col-span-2"
          rows={3}
          placeholder="Store description"
          value={form.storeDescription}
          onChange={(e) => setForm({ ...form, storeDescription: e.target.value })}
        />
      </div>

      <h2 className="text-xl font-black mt-8 mb-4">Contact Information</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="email"
          className="input"
          placeholder="Contact email"
          value={form.contactEmail}
          onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
        />
        <input
          className="input"
          placeholder="Contact phone"
          value={form.contactPhone}
          onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
        />
        <input
          className="input"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          className="input"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          className="input"
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
        <input
          className="input"
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />
        <input
          className="input"
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />
        <input
          className="input"
          placeholder="GST Number"
          value={form.gstNumber}
          onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
        />
      </div>

      <h2 className="text-xl font-black mt-8 mb-4">Business Settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <select
          className="input"
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
        >
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
        </select>
        <input
          type="number"
          step="0.01"
          className="input"
          placeholder="Tax percentage"
          value={form.taxPercentage}
          onChange={(e) => setForm({ ...form, taxPercentage: Number(e.target.value) })}
        />
        <input
          type="number"
          className="input"
          placeholder="Standard shipping charge"
          value={form.shippingCharge}
          onChange={(e) => setForm({ ...form, shippingCharge: Number(e.target.value) })}
        />
        <input
          type="number"
          className="input"
          placeholder="Free shipping above"
          value={form.freeShippingAbove}
          onChange={(e) => setForm({ ...form, freeShippingAbove: Number(e.target.value) })}
        />
      </div>

      <h2 className="text-xl font-black mt-8 mb-4">Social Links</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Facebook URL"
          value={form.facebook}
          onChange={(e) => setForm({ ...form, facebook: e.target.value })}
        />
        <input
          className="input"
          placeholder="Instagram URL"
          value={form.instagram}
          onChange={(e) => setForm({ ...form, instagram: e.target.value })}
        />
        <input
          className="input"
          placeholder="Twitter URL"
          value={form.twitter}
          onChange={(e) => setForm({ ...form, twitter: e.target.value })}
        />
        <input
          className="input"
          placeholder="LinkedIn URL"
          value={form.linkedin}
          onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
        />
      </div>

      {message && (
        <p className={`mt-4 text-sm ${message.includes("saved") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
      <button className="btn-primary mt-8">Save Settings</button>
    </form>
  );
}
