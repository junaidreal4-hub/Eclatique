import sharp from "sharp";
import { mkdirSync, existsSync, statSync } from "node:fs";

const src = "d:/Projects/Eclatique/project/public/images/ECLATIQUE LOGO BROWN.png";
if (!existsSync("public/brand")) mkdirSync("public/brand", { recursive: true });

const meta = await sharp(src).metadata();
console.log(`source: ${meta.width}x${meta.height} alpha=${meta.hasAlpha}`);

await sharp(src)
  .resize({ height: 160, withoutEnlargement: true })
  .webp({ quality: 92 })
  .toFile("public/brand/eclatique-logo.webp");

const out = await sharp("public/brand/eclatique-logo.webp").metadata();
console.log(`logo webp: ${out.width}x${out.height}, ${statSync("public/brand/eclatique-logo.webp").size} bytes`);
