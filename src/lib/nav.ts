import { CATEGORIES, SUBCATEGORIES } from "./taxonomy";

export interface NavLink {
  href: string;
  label: string;
}
export interface NavGroup {
  label: string;
  href: string;
  children: NavLink[];
}

// Flat links shown before/after the category dropdowns.
export const NAV_LEADING: NavLink[] = [{ href: "/collections/all", label: "Shop All" }];
export const NAV_TRAILING: NavLink[] = [
  { href: "/collections/new", label: "New" },
  { href: "/collections/sale", label: "Sale" },
];

// Men / Women, each expanding to the shared sub-categories.
export const NAV_GROUPS: NavGroup[] = CATEGORIES.map((c) => ({
  label: c.label,
  href: `/collections/${c.slug}`,
  children: [
    { href: `/collections/${c.slug}`, label: `All ${c.label}` },
    ...SUBCATEGORIES.map((s) => ({
      href: `/collections/${c.slug}-${s.slug}`,
      label: s.label,
    })),
  ],
}));

export const FOOTER_SHOP: NavLink[] = [
  { href: "/collections/all", label: "Shop All" },
  { href: "/collections/men", label: "Men" },
  { href: "/collections/women", label: "Women" },
  { href: "/collections/new", label: "New Arrivals" },
  { href: "/collections/sale", label: "Sale" },
];

export const FOOTER_POLICIES: NavLink[] = [
  { href: "/pages/about", label: "About Us" },
  { href: "/pages/contact", label: "Contact Us" },
  { href: "/pages/shipping-returns", label: "Shipping & Returns" },
  { href: "/pages/terms", label: "Terms & Conditions" },
  { href: "/pages/privacy", label: "Privacy Policy" },
];
