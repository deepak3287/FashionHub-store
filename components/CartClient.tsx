"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const CART_KEY = "fashionhub_cart";

export function getLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToLocalCart(item: CartItem) {
  const cart = getLocalCart();
  const existing = cart.find(
    (x) => x.productId === item.productId && x.size === item.size && x.color === item.color
  );
  if (existing) existing.quantity += item.quantity;
  else cart.push(item);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearLocalCart() {
  localStorage.removeItem(CART_KEY);
}

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getLocalCart());
  }, []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
    const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 99;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [items]);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  if (!items.length) {
    return (
      <div className="premium-container py-16">
        <div className="premium-card mx-auto max-w-xl p-10 text-center">
          <h1 className="text-3xl font-black">Your cart is empty</h1>
          <p className="mt-3 text-black/60">Explore premium fashion products and add them to your cart.</p>
          <Link href="/shop" className="btn-primary mt-6">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-container py-10">
      <h1 className="text-3xl font-black">Shopping Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-4">
          {items.map((item, index) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="premium-card flex gap-4 p-4">
              <img src={item.image} alt={item.title} className="h-28 w-24 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-black/55">Size: {item.size || "Default"} · Color: {item.color || "Default"}</p>
                  <p className="mt-2 font-bold">{formatCurrency(item.salePrice || item.price)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const next = [...items];
                      next[index].quantity = Math.max(1, Number(e.target.value));
                      persist(next);
                    }}
                    className="w-20 rounded-xl border-black/10"
                  />
                  <button
                    onClick={() => persist(items.filter((_, i) => i !== index))}
                    className="rounded-xl p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="premium-card h-fit p-6">
          <h2 className="text-xl font-black">Order Summary</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><b>{formatCurrency(totals.subtotal)}</b></div>
            <div className="flex justify-between"><span>Shipping</span><b>{totals.shipping ? formatCurrency(totals.shipping) : "Free"}</b></div>
            <div className="border-t pt-3 flex justify-between text-lg"><span>Total</span><b>{formatCurrency(totals.total)}</b></div>
          </div>
          <div className="mt-5 rounded-xl bg-cream p-3 text-xs text-black/65">
            Secure prepaid checkout only. COD is not available on FashionHub.
          </div>
          <Link href="/checkout" className="btn-gold mt-5 w-full">Proceed to Checkout</Link>
        </aside>
      </div>
    </div>
  );
}
