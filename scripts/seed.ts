import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db";
import { User, Product, Category, Coupon, CourierPartner, PaymentGateway, StoreSetting } from "../lib/models";
import { slugify } from "../lib/format";

async function seed() {
  await connectDB();

  await User.findOneAndUpdate(
    { email: "admin@fashionhub.local" },
    {
      name: "FashionHub Admin",
      email: "admin@fashionhub.local",
      passwordHash: await bcrypt.hash("Admin@12345", 12),
      role: "admin"
    },
    { upsert: true, new: true }
  );

  const categories = ["Men", "Women", "Kids", "Footwear", "Accessories"];
  for (const name of categories) {
    await Category.findOneAndUpdate(
      { slug: slugify(name) },
      { name, slug: slugify(name), active: true },
      { upsert: true }
    );
  }

  const products = [
    {
      title: "Premium Linen Oversized Shirt",
      description: "A breathable premium linen oversized shirt made for modern luxury styling.",
      price: 2499,
      salePrice: 1899,
      category: "Men",
      brand: "FashionHub",
      fabric: "Linen blend",
      sku: "FH-MEN-SHIRT-001",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Beige", "Black", "White"],
      stock: 25,
      featured: true,
      trending: true,
      newArrival: true,
      images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=900&auto=format&fit=crop"]
    },
    {
      title: "Elegant Satin Evening Dress",
      description: "Premium satin evening dress with a clean silhouette and luxury finish.",
      price: 4999,
      salePrice: 3799,
      category: "Women",
      brand: "FashionHub",
      fabric: "Satin",
      sku: "FH-WOMEN-DRESS-001",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Champagne"],
      stock: 18,
      featured: true,
      newArrival: true,
      images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=900&auto=format&fit=crop"]
    },
    {
      title: "Minimal White Sneakers",
      description: "Clean premium sneakers designed for comfort and everyday fashion.",
      price: 3299,
      salePrice: 2599,
      category: "Footwear",
      brand: "FashionHub",
      fabric: "Vegan leather",
      sku: "FH-SHOE-001",
      sizes: ["6", "7", "8", "9", "10"],
      colors: ["White"],
      stock: 32,
      featured: true,
      images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop"]
    },
    {
      title: "Classic Gold Accent Handbag",
      description: "Structured premium handbag with gold-tone accents and elegant storage.",
      price: 3999,
      salePrice: 2999,
      category: "Accessories",
      brand: "FashionHub",
      fabric: "PU leather",
      sku: "FH-BAG-001",
      colors: ["Black", "Brown"],
      stock: 20,
      trending: true,
      images: ["https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=900&auto=format&fit=crop"]
    }
  ];

  for (const product of products) {
    await Product.findOneAndUpdate(
      { slug: slugify(product.title) },
      { ...product, slug: slugify(product.title), active: true, tags: [product.category, product.brand, "premium"] },
      { upsert: true }
    );
  }

  await Coupon.findOneAndUpdate(
    { code: "FASHION10" },
    { code: "FASHION10", type: "percentage", value: 10, minOrderValue: 999, active: true },
    { upsert: true }
  );

  await CourierPartner.findOneAndUpdate(
    { name: "Custom Courier" },
    { name: "Custom Courier", provider: "custom", enabled: true, trackingBaseUrl: "https://example.com/track/" },
    { upsert: true }
  );

  await PaymentGateway.findOneAndUpdate(
    { name: "razorpay" },
    { name: "razorpay", enabled: true, active: true },
    { upsert: true }
  );

  await StoreSetting.findOneAndUpdate(
    { storeName: "FashionHub" },
    {
      storeName: "FashionHub",
      contactEmail: "support@fashionhub.local",
      contactPhone: "+91 99999 99999",
      invoicePrefix: "FH",
      shippingPolicy: "Tracked courier shipping. Free shipping above ₹1,999.",
      returnPolicy: "Returns can be requested based on store rules."
    },
    { upsert: true }
  );

  console.log("Seed completed.");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
