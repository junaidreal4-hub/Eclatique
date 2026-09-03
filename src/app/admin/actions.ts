"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  endSession,
  isAuthenticated,
  startSession,
  verifyPassword,
} from "@/lib/auth";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/products";
import { addReel, deleteReel, updateReelOrder } from "@/lib/reels";
import { ALL_SIZES } from "@/lib/taxonomy";
import type { Category, Size, SubCategory } from "@/lib/types";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await startSession();
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

function parseProductInput(formData: FormData): ProductInput {
  const sizes: Size[] = [];
  const stock: Partial<Record<Size, number>> = {};

  if (formData.get("oneSize") === "on") {
    // Accessory / no-size item: a single "One Size" entry with one stock count.
    const qty = Math.max(0, Math.floor(Number(formData.get("os_stock")) || 0));
    sizes.push("OS");
    stock["OS"] = qty;
  } else {
    for (const size of ALL_SIZES) {
      const raw = formData.get(`stock_${size}`);
      if (raw !== null && String(raw).trim() !== "") {
        sizes.push(size);
        stock[size] = Math.max(0, Math.floor(Number(raw) || 0));
      }
    }
  }

  const images = formData
    .getAll("images")
    .map((v) => String(v).trim())
    .filter(Boolean);

  const price = Math.round(Number(formData.get("price")) || 0);
  const compareRaw = formData.get("compareAtPrice");
  const compareNum =
    compareRaw === null || String(compareRaw).trim() === ""
      ? null
      : Math.round(Number(compareRaw));

  return {
    name: String(formData.get("name") ?? "").trim(),
    colorway: String(formData.get("colorway") ?? "").trim(),
    price,
    compareAtPrice: compareNum && compareNum > 0 ? compareNum : null,
    category: String(formData.get("category") ?? "men") as Category,
    subCategory: String(formData.get("subCategory") ?? "shirt") as SubCategory,
    variantGroup: String(formData.get("variantGroup") ?? "").trim(),
    images,
    sizes,
    stock,
    description: String(formData.get("description") ?? "").trim(),
    details: String(formData.get("details") ?? "").trim(),
    isNew: formData.get("isNew") === "on",
  };
}

export async function saveProductAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const idRaw = formData.get("id");
  const input = parseProductInput(formData);

  if (!input.name || !input.price) {
    const back = idRaw ? `/admin/products/${idRaw}/edit` : "/admin/products/new";
    redirect(`${back}?error=1`);
  }

  if (idRaw && String(idRaw).trim() !== "") {
    await updateProduct(Number(idRaw), input);
  } else {
    await createProduct(input);
  }

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (id) {
    await deleteProduct(id);
    revalidatePath("/", "layout");
  }
  redirect("/admin/products");
}

// ---- Reels -----------------------------------------------------------------

export async function addReelAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const url = String(formData.get("videoUrl") ?? "").trim();
  if (url) {
    await addReel(url);
    revalidatePath("/", "layout");
  }
  redirect("/admin/reels");
}

export async function deleteReelAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (id) {
    await deleteReel(id);
    revalidatePath("/", "layout");
  }
  redirect("/admin/reels");
}

export async function updateReelOrderAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  const order = Number(formData.get("sortOrder"));
  if (id) {
    await updateReelOrder(id, Number.isFinite(order) ? order : 0);
    revalidatePath("/", "layout");
  }
  redirect("/admin/reels");
}
