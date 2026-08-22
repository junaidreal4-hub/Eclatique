// Lightweight nav config kept free of product imports so client components
// (header/footer) don't pull the catalogue into the browser bundle.

export const NAV_ITEMS: { handle: string; title: string }[] = [
  { handle: "all", title: "View All" },
  { handle: "men", title: "Men" },
  { handle: "women", title: "Women" },
  { handle: "new", title: "New" },
  { handle: "sale", title: "Sale" },
];

export const FOOTER_SHOP: { href: string; label: string }[] = [
  { href: "/collections/all", label: "View All" },
  { href: "/collections/men", label: "Men" },
  { href: "/collections/women", label: "Women" },
  { href: "/collections/new", label: "New Arrivals" },
  { href: "/collections/sale", label: "Sale" },
];

export const FOOTER_POLICIES: { href: string; label: string }[] = [
  { href: "/pages/about", label: "About Us" },
  { href: "/pages/contact", label: "Contact Us" },
  { href: "/pages/shipping-returns", label: "Shipping & Returns" },
  { href: "/pages/terms", label: "Terms & Conditions" },
  { href: "/pages/privacy", label: "Privacy Policy" },
];
