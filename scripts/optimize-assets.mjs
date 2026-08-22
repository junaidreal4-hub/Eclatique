// One-time asset optimizer: pulls images from the old Laravel project,
// resizes + converts to WebP, and writes them into public/.
// Run with: node scripts/optimize-assets.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OLD = "d:/Projects/Eclatique/project";
const SRC_IMG = path.join(OLD, "public/images");
const SRC_PROD = path.join(OLD, "storage/app/public/products");
const OUT = "d:/Projects/Eclatique/eclatique-store/public";

const jobs = [
  // Product images (portrait 3:4) — the 5 real uploads + 2 model shots + lifestyle fill
  { src: `${SRC_PROD}/9XSVUF8roVv059yLFXwMjguBnh4f8VQn4vTnbmfy.png`, out: "products/product-1.webp", w: 900, h: 1200, fit: "cover" },
  { src: `${SRC_PROD}/joAgWLUArcNOlPTiwK4RsIj80BvizZLLB6gBSsS2.png`, out: "products/product-2.webp", w: 900, h: 1200, fit: "cover" },
  { src: `${SRC_PROD}/qqzMgl6kPESr8JJydPpCj8QWQmYfjQs1mmn7WTTZ.png`, out: "products/product-3.webp", w: 900, h: 1200, fit: "cover" },
  { src: `${SRC_PROD}/6evy6kjhkQaPe2smYoOjXHtBiODcDjMcKhRVULpF.png`, out: "products/product-4.webp", w: 900, h: 1200, fit: "cover" },
  { src: `${SRC_IMG}/singlesuhani.jpg`, out: "products/product-5.webp", w: 900, h: 1200, fit: "cover" },
  { src: `${SRC_IMG}/singlevarun.jpg`, out: "products/product-6.webp", w: 900, h: 1200, fit: "cover" },
  { src: `${SRC_IMG}/visual-1.jpg`, out: "products/product-7.webp", w: 900, h: 1200, fit: "cover" },
  { src: `${SRC_IMG}/visual-2.jpg`, out: "products/product-8.webp", w: 900, h: 1200, fit: "cover" },
  { src: `${SRC_IMG}/visual-3.jpg`, out: "products/product-9.webp", w: 900, h: 1200, fit: "cover" },
  { src: `${SRC_IMG}/visual-4.jpg`, out: "products/product-10.webp", w: 900, h: 1200, fit: "cover" },

  // Hero banners (wide)
  { src: `${SRC_IMG}/carousel-1.png`, out: "hero/hero-1.webp", w: 2000, fit: "inside" },
  { src: `${SRC_IMG}/carousel-2.png`, out: "hero/hero-2.webp", w: 2000, fit: "inside" },
  { src: `${SRC_IMG}/carousel-3.png`, out: "hero/hero-3.webp", w: 2000, fit: "inside" },

  // Lifestyle / editorial
  { src: `${SRC_IMG}/visual-1.jpg`, out: "lifestyle/lifestyle-1.webp", w: 1400, fit: "inside" },
  { src: `${SRC_IMG}/visual-2.jpg`, out: "lifestyle/lifestyle-2.webp", w: 1400, fit: "inside" },
  { src: `${SRC_IMG}/singlesuhani.jpg`, out: "lifestyle/editorial-1.webp", w: 1400, h: 1750, fit: "cover" },
  { src: `${SRC_IMG}/singlevarun.jpg`, out: "lifestyle/editorial-2.webp", w: 1400, h: 1750, fit: "cover" },

  // Brand / utility
  { src: `${SRC_IMG}/size-guide-men.jpg`, out: "brand/size-guide-men.webp", w: 900, fit: "inside" },
  { src: `${SRC_IMG}/size-guide-women.jpg`, out: "brand/size-guide-women.webp", w: 900, fit: "inside" },
];

async function ensureDir(file) {
  const dir = path.dirname(path.join(OUT, file));
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

let ok = 0;
let skipped = 0;
for (const job of jobs) {
  if (!existsSync(job.src)) {
    console.warn(`SKIP (missing): ${job.src}`);
    skipped++;
    continue;
  }
  await ensureDir(job.out);
  const pipeline = sharp(job.src).resize({
    width: job.w,
    height: job.h,
    fit: job.fit,
    position: "attention", // smart crop toward the subject
    withoutEnlargement: true,
  });
  await pipeline.webp({ quality: 80 }).toFile(path.join(OUT, job.out));
  ok++;
  console.log(`OK  ${job.out}`);
}
console.log(`\nDone. ${ok} written, ${skipped} skipped.`);
