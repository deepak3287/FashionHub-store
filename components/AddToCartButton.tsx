"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { addToLocalCart } from "./CartClient";
import { CartItem } from "@/lib/types";

export function AddToCartButton({ item, disabled }: { item: CartItem; disabled?: boolean }) {
  const [added, setAdded] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={() => {
        addToLocalCart(item);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
      className="btn-primary w-full gap-2"
    >
      <ShoppingBag size={18} />
      {added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}
