import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { StoreOnly } from "@/components/store-only";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eclatique.in"),
  title: {
    default: "Eclatique | Choose the Unordinary",
    template: "%s · Eclatique",
  },
  description:
    "Premium essentials for the modern silhouette. Avant-garde fashion for those who refuse to blend in.",
  openGraph: {
    title: "Eclatique | Choose the Unordinary",
    description: "Premium essentials for the modern silhouette.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <CartProvider>
          <StoreOnly>
            <AnnouncementBar />
            <Header />
          </StoreOnly>
          <main className="flex-1">{children}</main>
          <StoreOnly>
            <Footer />
            <CartDrawer />
          </StoreOnly>
        </CartProvider>
      </body>
    </html>
  );
}
