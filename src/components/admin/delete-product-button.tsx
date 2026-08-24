"use client";

import { deleteProductAction } from "@/app/admin/actions";

export function DeleteProductButton({ id }: { id: number }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm("Delete this product? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm font-medium text-sale underline underline-offset-2 hover:opacity-70"
      >
        Delete
      </button>
    </form>
  );
}
