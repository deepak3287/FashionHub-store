"use client";

import { useState } from "react";

export default function SizeSelector({ sizes, variants, onChange }: { sizes: string[]; variants?: any[]; onChange: (size: string) => void }) {
  const [selected, setSelected] = useState("");

  function handleSelect(size: string, disabled?: boolean) {
    if (disabled) return;
    setSelected(size);
    onChange(size);
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold">Select Size</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((size) => {
          const variant = variants?.find((v: any) => v.size === size);
          const out = variant && variant.stock <= 0;
          return (
            <button
              key={size}
              type="button"
              onClick={() => handleSelect(size, out)}
              className={`rounded-xl border px-4 py-2 text-sm ${selected === size ? "bg-mutedgold text-white" : "bg-white"} ${out ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
