"use client";

import { useState } from "react";
import SizeSelector from "./SizeSelector";
import { AddToCartButton } from "./AddToCartButton";

export default function ProductActions({ product, image }: { product: any; image: string }) {
  const [selectedSize, setSelectedSize] = useState("");

  return (
    <div>
      <SizeSelector sizes={product.sizes || []} variants={product.variants || []} onChange={(s) => setSelectedSize(s)} />
      <div className="mt-6 flex gap-3">
        <AddToCartButton
          disabled={!selectedSize}
          item={{
            productId: product._id,
            title: product.title,
            slug: product.slug,
            image,
            price: product.price,
            salePrice: product.salePrice,
            quantity: 1,
            size: selectedSize,
            color: product.colors?.[0]
          }}
        />
      </div>
    </div>
  );
}
