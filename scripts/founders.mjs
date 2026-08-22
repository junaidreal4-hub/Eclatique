// Full-aspect (uncropped) founder portraits for the Our Story page.
// Source images are 2:3 portrait; we preserve that ratio (no cropping).
import sharp from "sharp";

const SRC = "d:/Projects/Eclatique/project/public/images";
const OUT = "d:/Projects/Eclatique/eclatique-store/public/about";

const jobs = [
  { src: `${SRC}/singlevarun.jpg`, out: `${OUT}/founder-varun.webp` },
  { src: `${SRC}/singlesuhani.jpg`, out: `${OUT}/founder-twinkle.webp` },
];

for (const job of jobs) {
  await sharp(job.src)
    .resize({ width: 1100, fit: "inside", withoutEnlargement: true }) // keep full frame
    .webp({ quality: 85 })
    .toFile(job.out);
  const m = await sharp(job.out).metadata();
  console.log(`OK ${job.out} (${m.width}x${m.height})`);
}
