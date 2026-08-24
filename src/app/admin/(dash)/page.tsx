import Link from "next/link";
import { countProducts } from "@/lib/products";

export default async function AdminDashboard() {
  const total = await countProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Manage your catalogue.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="border border-line bg-paper p-8">
          <p className="label text-[11px] text-faint">Total Products</p>
          <p className="mt-2 text-5xl font-bold">{total}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="label bg-accent px-6 py-3 text-[11px] text-paper hover:opacity-90"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/products/new"
              className="label border border-ink px-6 py-3 text-[11px] hover:bg-ink hover:text-paper"
            >
              + Add Product
            </Link>
          </div>
        </div>

        <div className="border border-line bg-paper p-8">
          <p className="label text-[11px] text-faint">Orders</p>
          <p className="mt-2 text-sm text-muted">
            Order management arrives with the payment integration (next phase).
          </p>
        </div>
      </div>
    </div>
  );
}
