"use client";

import { useEffect, useMemo, useState } from "react";
import { getLocalCart, clearLocalCart } from "./CartClient";
import { CartItem } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export default function CheckoutClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [gateway, setGateway] = useState<"razorpay" | "stripe">("razorpay");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    setItems(getLocalCart());
  }, []);

  const total = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
    const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 99;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [items]);

  async function handlePay() {
    setLoading(true);
    try {
      const payload = {
        customer: { name: form.name, email: form.email, phone: form.phone },
        shippingAddress: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: "India"
        },
        items
      };

      if (gateway === "stripe") {
        const res = await fetch("/api/payments/stripe/create-session", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to create Stripe session");
        window.location.href = data.url;
        return;
      }

      const res = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to create payment order");

      const Razorpay = (window as any).Razorpay;
      if (!Razorpay) {
        alert("Razorpay script missing. Add Razorpay checkout script in production layout.");
        return;
      }

      const rzp = new Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "FashionHub",
        description: "Prepaid FashionHub Order",
        order_id: data.razorpayOrderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            body: JSON.stringify({
              ...response,
              pendingOrderId: data.pendingOrderId
            })
          });
          const verified = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verified.error || "Payment verification failed");
          clearLocalCart();
          window.location.href = `/payment/success?order=${verified.orderNumber}`;
        },
        modal: {
          ondismiss: function () {
            window.location.href = "/payment/failed";
          }
        }
      });

      rzp.open();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="premium-container py-10">
      <h1 className="text-3xl font-black">Secure Prepaid Checkout</h1>
      <p className="mt-2 text-black/60">COD is not available. Your order is generated after payment confirmation.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="premium-card p-6">
          <h2 className="text-xl font-black">Shipping Details</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["name", "Full name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["line1", "Address line 1"],
              ["line2", "Address line 2"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"]
            ].map(([key, label]) => (
              <input
                key={key}
                className="input"
                placeholder={label}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            ))}
          </div>

          <h2 className="mt-8 text-xl font-black">Payment Gateway</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setGateway("razorpay")}
              className={`rounded-xl border p-4 text-left ${gateway === "razorpay" ? "border-champagne bg-cream" : "border-black/10 bg-white"}`}
            >
              <b>Razorpay</b>
              <p className="text-sm text-black/55">UPI, cards, netbanking, wallet</p>
            </button>
            <button
              onClick={() => setGateway("stripe")}
              className={`rounded-xl border p-4 text-left ${gateway === "stripe" ? "border-champagne bg-cream" : "border-black/10 bg-white"}`}
            >
              <b>Stripe</b>
              <p className="text-sm text-black/55">Cards and international payments</p>
            </button>
          </div>
        </div>

        <aside className="premium-card h-fit p-6">
          <h2 className="text-xl font-black">Order Summary</h2>
          <div className="mt-4 grid gap-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                <img src={item.image} alt={item.title} className="h-16 w-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-black/50">Qty {item.quantity}</p>
                </div>
                <b className="text-sm">{formatCurrency((item.salePrice || item.price) * item.quantity)}</b>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t pt-4 grid gap-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><b>{formatCurrency(total.subtotal)}</b></div>
            <div className="flex justify-between"><span>Shipping</span><b>{total.shipping ? formatCurrency(total.shipping) : "Free"}</b></div>
            <div className="flex justify-between text-lg"><span>Total</span><b>{formatCurrency(total.total)}</b></div>
          </div>
          <button disabled={loading || !items.length} onClick={handlePay} className="btn-gold mt-5 w-full">
            {loading ? "Processing..." : `Pay ${formatCurrency(total.total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-black/50">100% secure prepaid payment</p>
        </aside>
      </div>
    </div>
  );
}
