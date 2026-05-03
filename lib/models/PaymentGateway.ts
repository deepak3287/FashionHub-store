import mongoose, { Schema, models } from "mongoose";

const PaymentGatewaySchema = new Schema(
  {
    name: { type: String, enum: ["razorpay", "stripe"], required: true, unique: true },
    enabled: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    publicKey: String,
    encryptedSecretKey: String,
    webhookSecret: String
  },
  { timestamps: true }
);

export const PaymentGateway =
  models.PaymentGateway || mongoose.model("PaymentGateway", PaymentGatewaySchema);
