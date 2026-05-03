import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: Number,
    category: { type: String, required: true, index: true },
    subcategory: String,
    brand: String,
    fabric: String,
    sku: String,
    tags: [String],
    sizes: [String],
    colors: [String],
    stock: { type: Number, default: 0 },
    images: [String],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    sold: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text", tags: "text", brand: "text" });

export const Product = models.Product || mongoose.model("Product", ProductSchema);
