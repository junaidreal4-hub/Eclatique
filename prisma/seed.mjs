import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "blue-striped-full-zip-shirt",
    name: "Blue Striped Full-Zip Shirt",
    colorway: "Blue Stripe",
    price: 899,
    compareAtPrice: 1099,
    category: "men",
    subCategory: "shirt",
    variantGroup: "full-zip-shirt",
    images: ["/products/blue-zip-shirt-1.webp", "/products/blue-zip-shirt-2.webp", "/products/blue-zip-shirt-3.webp"],
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    stock: { S: 0, M: 1, L: 0, XL: 5, XXL: 0, XXXL: 0 },
    description:
      "Redefine everyday dressing with this blue striped half-sleeve shirt, perfect for coastal vacations, summer brunches, creative office wear, and relaxed evenings. Crafted from a breathable cotton-poly blend, it delivers comfort with a clean, structured look. The modern full-zip front adds versatility, making it easy to style for both casual and elevated settings.\n\nStyling Suggestion: Pair with white or beige trousers and sneakers for a clean, Mediterranean-inspired look.",
    details:
      "Fit: Slim Fit · Model wears size M\nSleeve: Half Sleeve · Closure: Full Zip\nPattern: Striped\nFabric: 80% Cotton, 20% Polyester\nWash Care: Machine Wash",
    isNew: true,
    createdAt: new Date("2026-08-14"),
  },
  {
    slug: "butter-yellow-full-zip-shirt",
    name: "Butter Yellow Striped Full-Zip Shirt",
    colorway: "Butter Yellow",
    price: 899,
    compareAtPrice: 1099,
    category: "men",
    subCategory: "shirt",
    variantGroup: "full-zip-shirt",
    images: ["/products/butter-zip-shirt-1.webp", "/products/butter-zip-shirt-2.webp", "/products/butter-zip-shirt-3.webp"],
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    stock: { S: 1, M: 3, L: 3, XL: 0, XXL: 2, XXXL: 1 },
    description:
      "Fresh and refined, this butter yellow half-sleeve shirt is ideal for summer travel, daytime events, resort wear, and smart casual outings. Made from a lightweight cotton-poly blend, it offers breathable comfort with a modern silhouette. The full-zip design keeps the look sharp yet relaxed.\n\nStyling Suggestion: Style with neutral trousers and minimal sneakers or loafers.",
    details:
      "Fit: Slim Fit · Model wears size M\nSleeve: Half Sleeve · Closure: Full Zip\nColour: Butter Yellow\nFabric: 80% Cotton, 20% Polyester\nWash Care: Machine Wash",
    isNew: true,
    createdAt: new Date("2026-08-13"),
  },
  {
    slug: "blue-striped-lace-up-top",
    name: "Blue Striped Lace-Up Top",
    colorway: "Blue Stripe",
    price: 699,
    compareAtPrice: 899,
    category: "women",
    subCategory: "tshirt",
    variantGroup: "lace-up-top",
    images: ["/products/blue-laceup-top-1.webp", "/products/blue-laceup-top-2.webp", "/products/blue-laceup-top-3.webp", "/products/blue-laceup-top-4.webp"],
    sizes: ["XS", "S", "M", "L"],
    stock: { XS: 6, S: 1, M: 0, L: 5 },
    description:
      "Designed for brunch dates, casual evenings, vacation wear, and contemporary day looks, this blue striped top blends comfort with elegance. Crafted from a structured cotton-poly fabric, it features an adjustable lace-up back that enhances the silhouette while remaining easy to wear.\n\nStyling Suggestion: Pair with high-waist denim or skirts for an effortless, flattering look.",
    details:
      "Fit: Slim Fit · Model wears size S\nSleeve: Sleeveless · Closure: Lace-Up Back\nPattern: Striped\nFabric: 80% Cotton, 20% Polyester\nWash Care: Machine Wash",
    isNew: true,
    createdAt: new Date("2026-08-14"),
  },
  {
    slug: "butter-yellow-lace-up-top",
    name: "Butter Yellow Striped Lace-Up Top",
    colorway: "Butter Yellow",
    price: 699,
    compareAtPrice: 899,
    category: "women",
    subCategory: "tshirt",
    variantGroup: "lace-up-top",
    images: ["/products/butter-laceup-top-1.webp", "/products/butter-laceup-top-2.webp", "/products/butter-laceup-top-3.webp", "/products/butter-laceup-top-4.webp"],
    sizes: ["XS", "S", "M", "L"],
    stock: { XS: 0, S: 0, M: 0, L: 2 },
    description:
      "Soft and versatile, this butter yellow top is perfect for summer outings, vacations, daytime events, and soft evening looks. Made from a lightweight cotton-poly blend, it offers breathable comfort with a flattering shape, finished with an adjustable lace-up back.\n\nStyling Suggestion: Style with white or pastel bottoms and minimal accessories.",
    details:
      "Fit: Slim Fit · Model wears size S\nSleeve: Sleeveless · Closure: Lace-Up Back\nColour: Butter Yellow\nFabric: 80% Cotton, 20% Polyester\nWash Care: Machine Wash",
    isNew: true,
    createdAt: new Date("2026-08-13"),
  },
];

for (const p of products) {
  const data = {
    name: p.name,
    colorway: p.colorway,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    category: p.category,
    subCategory: p.subCategory,
    variantGroup: p.variantGroup ?? "",
    images: JSON.stringify(p.images),
    sizes: JSON.stringify(p.sizes),
    stock: JSON.stringify(p.stock),
    description: p.description,
    details: p.details,
    isNew: p.isNew,
    createdAt: p.createdAt,
  };
  await prisma.product.upsert({
    where: { slug: p.slug },
    update: data,
    create: { slug: p.slug, ...data },
  });
  console.log("seeded", p.slug);
}

// Seed the current homepage reels (only if none exist yet).
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
console.log("Done.");
