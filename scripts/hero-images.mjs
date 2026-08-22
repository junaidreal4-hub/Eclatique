// Optimizes the 4 Toasted Cloud lookbook images into hero slides.
// Native 9:16 kept (no crop in the file) — framing for desktop is handled in
// CSS via object-position so the top garment stays visible on every device.
import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";

const DL = "C:/Users/junai/Downloads";
const OUT = "d:/Projects/Eclatique/eclatique-store/public/hero";
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const jobs = [
  { src: `${DL}/IMG_8127.JPG.jpeg`, out: "hero-look-1.webp" }, // yellow zip shirt (m)
  { src: `${DL}/IMG_8128.JPG.jpeg`, out: "hero-look-2.webp" }, // blue zip shirt (m)
  { src: `${DL}/IMG_8129.JPG.jpeg`, out: "hero-look-3.webp" }, // blue lace-up top (w)
  { src: `${DL}/IMG_8130.JPG.jpeg`, out: "hero-look-4.webp" }, // yellow lace-up top (w)
];

for (const job of jobs) {
  await sharp(job.src)
    .resize({ width: 1080, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`${OUT}/${job.out}`);
  const m = await sharp(`${OUT}/${job.out}`).metadata();
  console.log(`OK ${job.out} (${m.width}x${m.height})`);
}
