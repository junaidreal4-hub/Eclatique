import Link from "next/link";
import { countProducts } from "@/lib/products";
import { countOrders } from "@/lib/orders";

export default async function AdminDashboard() {
  const [totalProducts, paidOrders] = await Promise.all([
    countProducts(),
    countOrders(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Manage your catalogue and orders.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="border border-line bg-paper p-8">
          <p className="label text-[11px] text-faint">Total Products</p>
          <p className="mt-2 text-5xl font-bold">{totalProducts}</p>
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
          <p className="label text-[11px] text-faint">Paid Orders</p>
          <p className="mt-2 text-5xl font-bold">{paidOrders}</p>
          <div className="mt-6">
            <Link
              href="/admin/orders"
              className="label bg-accent px-6 py-3 text-[11px] text-paper hover:opacity-90"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
