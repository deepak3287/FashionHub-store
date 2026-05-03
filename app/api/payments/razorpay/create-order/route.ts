import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/db";
import { Order, Product, Coupon } from "@/lib/models";
import { checkoutSchema } from "@/lib/validators";

function orderNumber() {
  return `FH-${Date.now()}`;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = checkoutSchema.parse(await req.json());

    const subtotal = body.items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
    const shippingCharge = subtotal > 1999 ? 0 : 99;
    let discount = 0;

    if (body.couponCode) {
      const coupon = await Coupon.findOne({ code: body.couponCode.toUpperCase(), active: true });
      if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date()) && subtotal >= coupon.minOrderValue) {
        discount = coupon.type === "percentage" ? Math.round(subtotal * (coupon.value / 100)) : coupon.value;
      }
    }

    const total = Math.max(1, subtotal + shippingCharge - discount);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || ""
    });

    const rpOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: orderNumber()
    });

    const pendingOrder = await Order.create({
      orderNumber: orderNumber(),
      customer: body.customer,
      shippingAddress: body.shippingAddress,
      billingAddress: body.shippingAddress,
      items: body.items,
      subtotal,
      shippingCharge,
      discount,
      total,
      couponCode: body.couponCode,
      paymentGateway: "razorpay",
      paymentStatus: "pending",
      paymentOrderId: rpOrder.id,
      status: "payment_confirmed"
    });

    return NextResponse.json({
      pendingOrderId: pendingOrder._id,
      razorpayOrderId: rpOrder.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: "INR"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to create Razorpay order" }, { status: 400 });
  }
}
