import mongoose, { Schema, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: String,
    slug: String,
    image: String,
    price: Number,
    salePrice: Number,
    quantity: Number,
    size: String,
    color: String
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" }
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User" },
    customer: {
      name: String,
      email: String,
      phone: String
    },
    items: [OrderItemSchema],
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema,
    subtotal: Number,
    shippingCharge: Number,
    discount: Number,
    total: Number,
    couponCode: String,
    paymentGateway: { type: String, enum: ["razorpay", "stripe", "manual"], default: "razorpay" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    paymentId: String,
    paymentOrderId: String,
    paymentSignature: String,
    status: {
      type: String,
      enum: [
        "payment_confirmed",
        "order_placed",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "return_requested",
        "returned"
      ],
      default: "payment_confirmed"
    },
    courierPartner: String,
    trackingId: String,
    trackingUrl: String,
    notes: String
  },
  { timestamps: true }
);

export const Order = models.Order || mongoose.model("Order", OrderSchema);
