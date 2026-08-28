"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImageUploader({
  defaultImages = [],
}: {
  defaultImages?: string[];
}) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setUploading(true);
    for (const file of Array.from(fileList)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Upload failed.");
          continue;
        }
        setImages((prev) => [...prev, data.url as string]);
      } catch {
        setError("Upload failed. Check your connection and try again.");
      }
    }
    setUploading(false);
  }

  function remove(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  function makeMain(url: string) {
    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
  }

  return (
    <div>
      {/* Submitted with the form as the product's image list */}
      {images.map((url) => (
        <input key={url} type="hidden" name="images" value={url} />
      ))}

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {images.map((url, i) => (
            <div key={url} className="group relative aspect-[3/4] overflow-hidden rounded border border-line bg-subtle">
              <Image src={url} alt="" fill sizes="120px" className="object-cover" />
              {i === 0 && (
                <span className="label absolute left-1 top-1 bg-accent px-1.5 py-0.5 text-[9px] text-paper">
                  Main
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-ink/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeMain(url)}
                    className="text-[9px] font-medium text-paper hover:underline"
                  >
                    Make main
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(url)}
                  className="ml-auto text-[9px] font-medium text-paper hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="label inline-flex cursor-pointer items-center gap-2 border border-ink px-4 py-2 text-[11px] hover:bg-ink hover:text-paper">
        {uploading ? "Uploading…" : "+ Add Photos"}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>

      {error && <p className="mt-2 text-xs font-medium text-sale">{error}</p>}
      <p className="mt-2 text-xs text-faint">
        The first photo is the main image. Drag isn&apos;t needed — use &ldquo;Make main&rdquo; to promote one.
      </p>
    </div>
  );
}
