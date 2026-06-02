import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Order, Product } from "@/lib/models";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-06-20"
  });

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig || "",
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await connectDB();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const pendingOrderId = session.metadata?.pendingOrderId;
    if (pendingOrderId) {
      const order = await Order.findById(pendingOrderId);
      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.paymentId = session.payment_intent?.toString();
        order.status = "order_placed";
        await order.save();

        for (const item of order.items) {
          const product = await Product.findById(item.productId);
          if (!product) continue;
          // decrement variant stock if size present
          if (item.size && product.variants && product.variants.length) {
            const variant = product.variants.find((v: any) => v.size === item.size);
            if (variant) {
              variant.stock = Math.max(0, variant.stock - item.quantity);
            }
          }
          // recompute total stock and sold
          product.stock = (product.variants || []).reduce((s: number, v: any) => s + (v.stock || 0), 0);
          product.sold = (product.sold || 0) + item.quantity;
          await product.save();
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
