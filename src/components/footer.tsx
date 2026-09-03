import Image from "next/image";
import Link from "next/link";
import { FOOTER_POLICIES, FOOTER_SHOP } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-subtle">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div>
            <Image
              src="/brand/eclatique-logo.webp"
              alt="Eclatique"
              width={749}
              height={160}
              className="h-7 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Elevated essentials for the modern silhouette. Considered clothing,
              made to be lived in.
            </p>
            <form className="mt-6 flex max-w-xs items-center border-b border-ink/30">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-faint"
                aria-label="Email address"
              />
              <button type="submit" className="label px-2 py-2 text-[11px]">
                Join
              </button>
            </form>
          </div>

          <FooterColumn title="Shop" links={FOOTER_SHOP} />
          <FooterColumn title="Help" links={FOOTER_POLICIES} />

          <div>
            <h4 className="label mb-4 text-[11px] text-ink">Contact</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a href="mailto:eclatiqueclothing@gmail.com" className="hover:text-ink">
                  eclatiqueclothing@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:9136598936" className="hover:text-ink">
                  +91 91365 98936
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/eclatiqueclothing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-faint sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Eclatique Clothing. All rights reserved.</p>
          <p className="label text-[10px]">Visa · Mastercard · UPI · RuPay</p>
        </div>
        <div className="mt-6 text-center text-[11px] text-faint">
          Crafted by{" "}
          <a
            href="https://mdjk.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium tracking-wide text-muted transition-colors hover:text-ink"
          >
            MDJK.dev
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="label mb-4 text-[11px] text-ink">{title}</h4>
      <ul className="space-y-3 text-sm text-muted">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-ink">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
