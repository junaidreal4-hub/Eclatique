import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-user";
import { getUserAddresses } from "@/lib/addresses";

// Used by the checkout page to offer a logged-in customer their saved addresses.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ loggedIn: false, addresses: [] });
  const addresses = await getUserAddresses(user.id);
  return NextResponse.json({
    loggedIn: true,
    email: user.email,
    name: user.name,
    addresses: addresses.map((a) => ({
      id: a.id,
      name: a.name,
      phone: a.phone,
      line: a.line,
      city: a.city,
      state: a.state,
      postalCode: a.postalCode,
      isDefault: a.isDefault,
    })),
  });
}
