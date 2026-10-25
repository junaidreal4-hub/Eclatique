import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-user";
import { getUserAddresses } from "@/lib/addresses";
import { INDIAN_STATES } from "@/lib/states";
import {
  addAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
  updateAddressAction,
} from "../actions";

export const metadata: Metadata = { title: "My Addresses" };
export const dynamic = "force-dynamic";

type Addr = Awaited<ReturnType<typeof getUserAddresses>>[number];

const inputCls =
  "w-full border-b border-line bg-transparent py-2 text-sm outline-none focus:border-ink placeholder:text-faint";

export default async function AddressesPage() {
  const user = await getCurrentUser();
  const addresses = user ? await getUserAddresses(user.id) : [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <Link href="/account" className="label text-[11px] text-muted hover:text-ink">
        ← Account
      </Link>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Saved Addresses</h1>

      {addresses.length > 0 && (
        <div className="mt-8 space-y-4">
          {addresses.map((a) => (
            <div key={a.id} className="border border-line bg-paper p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm">
                  <p className="font-medium">
                    {a.name}
                    {a.isDefault && (
                      <span className="label ml-2 bg-accent px-2 py-0.5 text-[9px] text-paper">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-muted">{a.phone}</p>
                  <p className="mt-1 text-muted">
                    {a.line}, {a.city}, {a.state} {a.postalCode}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                {!a.isDefault && (
                  <form action={setDefaultAddressAction}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="border-b border-ink pb-px font-medium hover:text-accent hover:border-accent">
                      Set as default
                    </button>
                  </form>
                )}
                <form action={deleteAddressAction}>
                  <input type="hidden" name="id" value={a.id} />
                  <button className="font-medium text-sale hover:underline">Delete</button>
                </form>
              </div>

              <details className="mt-3 text-sm">
                <summary className="label cursor-pointer list-none text-[10px] text-muted hover:text-ink">
                  Edit
                </summary>
                <div className="mt-4">
                  <AddressForm action={updateAddressAction} address={a} submitLabel="Save Changes" />
                </div>
              </details>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 border border-line bg-paper p-6">
        <h2 className="label mb-5 text-[10px] text-faint">Add a new address</h2>
        <AddressForm action={addAddressAction} submitLabel="Add Address" showDefault />
      </div>
    </div>
  );
}

function AddressForm({
  action,
  address,
  submitLabel,
  showDefault = false,
}: {
  action: (formData: FormData) => void;
  address?: Addr;
  submitLabel: string;
  showDefault?: boolean;
}) {
  return (
    <form action={action} className="space-y-4">
      {address && <input type="hidden" name="id" value={address.id} />}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full name" name="name" defaultValue={address?.name} />
        <Field label="Phone" name="phone" defaultValue={address?.phone} />
      </div>
      <Field label="Address" name="line" defaultValue={address?.line} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="City" name="city" defaultValue={address?.city} />
        <label className="block">
          <span className="label mb-2 block text-[10px] text-faint">State</span>
          <select name="state" required defaultValue={address?.state ?? ""} className={inputCls}>
            <option value="" disabled>Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <Field label="Postal code" name="postalCode" defaultValue={address?.postalCode} />
      {showDefault && (
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" name="makeDefault" />
          Make this my default address
        </label>
      )}
      <button
        type="submit"
        className="label bg-accent px-6 py-3 text-[11px] text-paper hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="label mb-2 block text-[10px] text-faint">{label}</span>
      <input name={name} required defaultValue={defaultValue} className={inputCls} />
    </label>
  );
}
