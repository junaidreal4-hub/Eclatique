// Reels-only seed (safe to run on production — never touches products/orders).
// Seeds the 4 homepage reels only if the table is empty.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const CLD = "https://res.cloudinary.com/dtkqhuitl/video/upload";
const reels = [
  `${CLD}/v1787426022/reel-1_euncff.mp4`,
  `${CLD}/v1787426021/reel-2_kuc9au.mp4`,
  `${CLD}/v1787426025/reel-3_i8w2cy.mp4`,
  `${CLD}/v1787426028/reel-4_xygde6.mp4`,
];

if ((await prisma.reel.count()) === 0) {
  for (let i = 0; i < reels.length; i++) {
    await prisma.reel.create({ data: { videoUrl: reels[i], sortOrder: i } });
  }
  console.log("seeded", reels.length, "reels");
} else {
  console.log("reels already present, skipping");
}

await prisma.$disconnect();
