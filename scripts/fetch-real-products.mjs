// Downloads the real product photography from the live site and writes
// optimized WebP into public/products. Run: node scripts/fetch-real-products.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT = "d:/Projects/Eclatique/eclatique-store/public/products";
const BASE = "https://eclatiqueclothing.in/storage/products/";

const jobs = [
  // Blue Striped Full-Zip Shirt (men, #15)
  { file: "gHzTDBQCiya3flZoiMmCSbr1bphfu1ZnpjVBRnzW.jpg", out: "blue-zip-shirt-1.webp" },
  { file: "wktmjk2nx9D2046hhBT9ardcCGDtZcKB40sZETCs.jpg", out: "blue-zip-shirt-2.webp" },
  { file: "z2oBe3I5dUZYc55ry99LIhQh5gmDboXrdHUlbcGG.jpg", out: "blue-zip-shirt-3.webp" },

  // Butter Yellow Striped Full-Zip Shirt (men, #14)
  { file: "OECi2Aah7qWAWTYFxXD9MRT9Cortiym3F2OePyCf.png", out: "butter-zip-shirt-1.webp" },
  { file: "l45HN2rySnp7cNMoJWctPq7O4hlgfKPSslt9pyye.jpg", out: "butter-zip-shirt-2.webp" },
  { file: "FIO67wAMb3zpTKjNQMceZnMpPWs6Ineum3NqkVPa.png", out: "butter-zip-shirt-3.webp" },

  // Blue Striped Lace-Up Top (women, #16)
  { file: "akho18Io1z9jhfEomNS6z2qIU6s1Ko9CsT719FMH.jpg", out: "blue-laceup-top-1.webp" },
  { file: "jevsSraXvWBgbCtAANrwCAZkHak5co8TbJBF1xsT.jpg", out: "blue-laceup-top-2.webp" },
  { file: "7Lb9HoPJcAO4p9FxSPShTP8YwTUJK8jCatb1Ywdm.jpg", out: "blue-laceup-top-3.webp" },
  { file: "i9Es5dkiaBJk9qMAuJsNXgXswRpAb018zpkUv8cd.jpg", out: "blue-laceup-top-4.webp" },

  // Butter Yellow Striped Lace-Up Top (women, #17)
  { file: "Mz9TTmYCpGQJdbQKvHbowhZ3Bo9x2sSoO2NK8Yxs.png", out: "butter-laceup-top-1.webp" },
  { file: "SdvisbSmjpI1tbs1hmGyE4EjBmO03YiTq1gWO6lU.png", out: "butter-laceup-top-2.webp" },
  { file: "GKQofmajhHzYqy8BH2VFGgS7yWxoQxXMrdnngRY0.png", out: "butter-laceup-top-3.webp" },
  { file: "EbXZ6FAZ7CFfXUFMyYIX5yU5uP4OP9L2X6limEVe.png", out: "butter-laceup-top-4.webp" },
];

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

let ok = 0;
let failed = 0;
for (const job of jobs) {
  try {
    const res = await fetch(BASE + job.file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize({ width: 900, height: 1200, fit: "cover", position: "attention" })
      .webp({ quality: 82 })
      .toFile(path.join(OUT, job.out));
    ok++;
    console.log(`OK  ${job.out}`);
  } catch (err) {
    failed++;
    console.warn(`FAIL ${job.out} <- ${job.file}: ${err.message}`);
  }
}
console.log(`\nDone. ${ok} written, ${failed} failed.`);
