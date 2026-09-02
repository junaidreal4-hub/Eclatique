import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
  Safe, idempotent update: links the original four seeded products into their
  colour-variant groups. Only touches these exact slugs, so any products the
  admin has added are left untouched. Run once after deploying the variant
  feature:  node prisma/seed-variants.mjs
*/
const groups = {
  "full-zip-shirt": ["blue-striped-full-zip-shirt", "butter-yellow-full-zip-shirt"],
  "lace-up-top": ["blue-striped-lace-up-top", "butter-yellow-lace-up-top"],
};

for (const [variantGroup, slugs] of Object.entries(groups)) {
  for (const slug of slugs) {
    const res = await prisma.product.updateMany({
      where: { slug },
      data: { variantGroup },
    });
    console.log(res.count ? `linked ${slug} -> ${variantGroup}` : `skip (not found) ${slug}`);
  }
}

await prisma.$disconnect();
console.log("Done.");
