import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatPrice } from "@/lib/format";
import { isSoldOut } from "@/lib/product-utils";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const soldOut = isSoldOut(product);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const hover = product.images[1];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-subtle">
        <Image
          src={product.images[0]}
          alt={`${product.name} in ${product.colorway}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className={`object-cover transition-opacity duration-500 ${
            hover ? "group-hover:opacity-0" : ""
          }`}
        />
        {hover && (
          <Image
            src={hover}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Badges */}
        <div className="absolute left-0 top-0 flex flex-col items-start gap-1 p-3">
          {discount && !soldOut && (
            <span className="label bg-sale px-2 py-1 text-[10px] text-paper">
              {discount}% Off
            </span>
          )}
          {product.isNew && !discount && !soldOut && (
            <span className="label bg-accent px-2 py-1 text-[10px] text-paper">New</span>
          )}
        </div>

        {soldOut && (
          <div className="absolute inset-x-0 bottom-0 bg-paper/90 py-2 text-center">
            <span className="label text-[10px] text-ink">Sold Out</span>
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-medium text-ink">{product.name}</h3>
        <p className="mt-0.5 text-xs text-faint">{product.colorway}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-ink">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-faint line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
