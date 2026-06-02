"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function DeleteButton({ id, endpoint, onSuccess }: { id: string; endpoint: string; onSuccess: () => void }) {
  const [confirming, setConfirming] = useState(false);

  async function deleteItem() {
    if (confirm("Are you sure? This action cannot be undone.")) {
      const res = await fetch(`/api/admin/${endpoint}/${id}`, { method: "DELETE" });
      if (res.ok) {
        onSuccess();
      }
    }
  }

  return (
    <button
      type="button"
      onClick={deleteItem}
      className="font-bold text-red-600 hover:text-red-800"
    >
      Delete
    </button>
  );
}
