import mongoose, { Schema, models } from "mongoose";

const StoreSettingSchema = new Schema(
  {
    storeName: { type: String, default: "FashionHub" },
    logo: String,
    contactEmail: String,
    contactPhone: String,
    businessAddress: String,
    gstNumber: String,
    invoicePrefix: { type: String, default: "FH" },
    socialLinks: {
      instagram: String,
      facebook: String,
      youtube: String,
      x: String
    },
    shippingPolicy: String,
    returnPolicy: String,
    privacyPolicy: String,
    terms: String,
    about: String
  },
  { timestamps: true }
);

export const StoreSetting =
  models.StoreSetting || mongoose.model("StoreSetting", StoreSettingSchema);
