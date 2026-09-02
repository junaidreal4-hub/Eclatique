import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { isAuthenticated } from "@/lib/auth";

// Product images are stored on the server's disk under /public/uploads and
// served directly by the app. Files there are gitignored, so they persist
// across deploys (git reset never removes untracked files).
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const ext = EXT_BY_TYPE[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Only image files are allowed (JPG, PNG, WebP, GIF, AVIF)." },
        { status: 400 },
      );
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "Image is too large (max 15 MB)." }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[upload] failed:", err);
    return NextResponse.json({ error: "Upload failed on the server." }, { status: 500 });
  }
}
