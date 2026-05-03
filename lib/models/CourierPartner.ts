import mongoose, { Schema, models } from "mongoose";

const CourierPartnerSchema = new Schema(
  {
    name: { type: String, required: true },
    provider: {
      type: String,
      enum: ["shiprocket", "delhivery", "bluedart", "dtdc", "custom"],
      default: "custom"
    },
    enabled: { type: Boolean, default: true },
    trackingBaseUrl: String,
    encryptedApiKey: String,
    encryptedApiSecret: String,
    shippingCharge: { type: Number, default: 0 },
    freeShippingAbove: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const CourierPartner =
  models.CourierPartner || mongoose.model("CourierPartner", CourierPartnerSchema);
