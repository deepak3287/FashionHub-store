export type Role = "admin" | "customer";

export type OrderStatus =
  | "payment_confirmed"
  | "order_placed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type CartItem = {
  productId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  salePrice?: number;
  size?: string;
  color?: string;
  quantity: number;
};
