import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: String,
    subcategories: [String],
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Category = models.Category || mongoose.model("Category", CategorySchema);
