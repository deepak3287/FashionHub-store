import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const productSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().nonnegative().optional(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  fabric: z.string().optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  // variants: array of { size, stock }
  variants: z.array(z.object({ size: z.string(), stock: z.coerce.number().int().min(0) })).default([]),
  stock: z.coerce.number().int().min(0),
  images: z.array(z.string().url()).min(1),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  active: z.boolean().default(true)
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
  subcategories: z.array(z.string()).default([]),
  active: z.boolean().default(true)
});

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8)
  }),
  shippingAddress: z.object({
    line1: z.string().min(5),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(4),
    country: z.string().default("India")
  }),
  items: z.array(z.object({
    productId: z.string(),
    title: z.string(),
    slug: z.string(),
    image: z.string(),
    price: z.number(),
    salePrice: z.number().optional(),
    quantity: z.number().int().positive(),
    size: z.string().optional(),
    color: z.string().optional()
  })).min(1),
  couponCode: z.string().optional()
});

export const couponSchema = z.object({
  code: z.string().min(2).max(20),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive(),
  minOrderValue: z.coerce.number().nonnegative().default(0),
  maxDiscount: z.coerce.number().nonnegative().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  usageCount: z.coerce.number().int().min(0).default(0),
  expiresAt: z.string().datetime().optional(),
  active: z.boolean().default(true),
  description: z.string().optional()
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).optional(),
  comment: z.string().min(10),
  verified: z.boolean().default(false),
  status: z.enum(["pending", "approved", "rejected"]).default("pending")
});

export const bannerSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  image: z.string().url(),
  link: z.string().url().optional(),
  position: z.enum(["hero", "secondary", "sidebar"]).default("hero"),
  active: z.boolean().default(true),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

export const storeSettingSchema = z.object({
  storeName: z.string().min(2).optional(),
  storeDescription: z.string().optional(),
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  gstNumber: z.string().optional(),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal(""))
  }).optional(),
  currency: z.string().default("INR"),
  taxPercentage: z.coerce.number().nonnegative().default(0),
  shippingCharge: z.coerce.number().nonnegative().default(0),
  freeShippingAbove: z.coerce.number().nonnegative().default(1999),
  policies: z.object({
    privacy: z.string().optional(),
    terms: z.string().optional(),
    shipping: z.string().optional(),
    returns: z.string().optional()
  }).optional()
});

export const courierSchema = z.object({
  name: z.string().min(2),
  provider: z.string().min(2),
  trackingBaseUrl: z.string().url().optional(),
  shippingCharge: z.coerce.number().nonnegative().default(0),
  estimatedDays: z.coerce.number().int().positive().optional(),
  enabled: z.boolean().default(true)
});
