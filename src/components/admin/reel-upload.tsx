"use client";

import { useRef, useState } from "react";
import { addReelAction } from "@/app/admin/actions";

/** Uploads a reel video to the server, then adds it to the homepage. */
export function ReelUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  async function handle(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-reel", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        setUploading(false);
        return;
      }
      // Hand the uploaded URL to the add-reel action and submit.
      if (urlRef.current) urlRef.current.value = data.url;
      formRef.current?.requestSubmit();
    } catch {
      setError("Upload failed. Check your connection and try again.");
      setUploading(false);
    }
  }

  return (
    <div>
      <form ref={formRef} action={addReelAction} className="hidden">
        <input ref={urlRef} name="videoUrl" readOnly />
      </form>

      <label className="label inline-flex cursor-pointer items-center gap-2 bg-accent px-6 py-2.5 text-[11px] text-paper hover:opacity-90">
        {uploading ? "Uploading video…" : "+ Upload Video"}
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          disabled={uploading}
          onChange={(e) => handle(e.target.files)}
          className="hidden"
        />
      </label>

      {uploading && (
        <p className="mt-2 text-xs text-muted">
          Large videos can take a little while — keep this tab open.
        </p>
      )}
      {error && <p className="mt-2 text-xs font-medium text-sale">{error}</p>}
    </div>
  );
}
