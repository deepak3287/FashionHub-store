import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models";
import { checkoutSchema } from "@/lib/validators";

function orderNumber() {
  return `FH-${Date.now()}`;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-06-20"
    });

    const body = checkoutSchema.parse(await req.json());
    const subtotal = body.items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
    const shippingCharge = subtotal > 1999 ? 0 : 99;
    const total = subtotal + shippingCharge;

    const pendingOrder = await Order.create({
      orderNumber: orderNumber(),
      customer: body.customer,
      shippingAddress: body.shippingAddress,
      billingAddress: body.shippingAddress,
      items: body.items,
      subtotal,
      shippingCharge,
      discount: 0,
      total,
      paymentGateway: "stripe",
      paymentStatus: "pending"
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: body.customer.email,
      line_items: body.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "inr",
          unit_amount: Math.round((item.salePrice || item.price) * 100),
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : []
          }
        }
      })),
      success_url: `${appUrl}/payment/success?order=${pendingOrder.orderNumber}`,
      cancel_url: `${appUrl}/payment/failed`,
      metadata: {
        pendingOrderId: pendingOrder._id.toString()
      }
    });

    pendingOrder.paymentOrderId = session.id;
    await pendingOrder.save();

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to create Stripe session" }, { status: 400 });
  }
}
