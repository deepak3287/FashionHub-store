import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { Order, Product } from "@/lib/models";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
      .digest("hex");

    if (expected !== body.razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const order = await Order.findById(body.pendingOrderId);
    if (!order) return NextResponse.json({ error: "Pending order not found" }, { status: 404 });

    order.paymentStatus = "paid";
    order.paymentId = body.razorpay_payment_id;
    order.paymentOrderId = body.razorpay_order_id;
    order.paymentSignature = body.razorpay_signature;
    order.status = "order_placed";
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Payment verification failed" }, { status: 400 });
  }
}
