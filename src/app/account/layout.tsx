import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-user";

// Everything under /account requires a logged-in customer.
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <>{children}</>;
}
