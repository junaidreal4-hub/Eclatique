// Optimizes the four "aesthetic" strip images used on the About page.
import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";

const SRC = "d:/Projects/Eclatique/project/public/images";
const OUT = "d:/Projects/Eclatique/eclatique-store/public/about";
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

for (let i = 1; i <= 4; i++) {
  // Preserve the native 9:16 aspect — show the full frame, no cropping.
  await sharp(`${SRC}/visual-${i}.jpg`)
    .resize({ width: 720, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`${OUT}/gallery-${i}.webp`);
  console.log(`OK gallery-${i}.webp`);
}
console.log("Done.");
