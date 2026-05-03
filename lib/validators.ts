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
