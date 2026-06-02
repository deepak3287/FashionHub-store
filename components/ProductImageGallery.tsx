"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImageGallery({ images }: { images: string[] }) {
  const [main, setMain] = useState(images[0] || "");
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-softgray shadow-premium">
        {main ? <img src={main} alt="product" className="object-cover w-full h-full" /> : <div />}
      </div>
      <div className="mt-3 flex gap-3">
        {images.map((img) => (
          <button key={img} type="button" onClick={() => setMain(img)} className="relative h-20 w-20 overflow-hidden rounded-xl bg-softgray">
            <img src={img} alt="thumb" className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
