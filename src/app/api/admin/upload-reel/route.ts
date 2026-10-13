import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { isAuthenticated } from "@/lib/auth";

// Reels are stored on the server's disk (served by Nginx from /uploads, with
// the /uploads/[name] route as a dev fallback) — no Cloudinary needed.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 80 * 1024 * 1024; // 80 MB
const EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
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
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "Only video files are allowed." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Video is too large (max 80 MB)." }, { status: 400 });
    }

    const ext = EXT[file.type] ?? "mp4";
    const buffer = Buffer.from(await file.arrayBuffer());
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `reel-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("[reel upload] failed:", err);
    return NextResponse.json({ error: "Upload failed on the server." }, { status: 500 });
  }
}
