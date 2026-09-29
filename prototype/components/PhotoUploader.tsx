"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PHOTO_TAGS, photoTagLabel, type PhotoTag } from "@/lib/photo-tags";

export function PhotoUploader({ locationId }: { locationId: string }) {
  const router = useRouter();
  const [tag, setTag] = useState<PhotoTag>("entrance");
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setState("saving");
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("locationId", locationId);
      form.append("tag", tag);
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Upload failed (${res.status})`);
      }
      setFile(null);
      setState("idle");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setState("error");
    }
  }

  return (
    <div style={{ border: "1px solid #DCE5DD", borderRadius: 10, padding: 12, marginTop: 16 }}>
      <p style={{ margin: "0 0 8px", fontWeight: 650 }}>Add a visual reference</p>
      <select value={tag} onChange={(e) => setTag(e.target.value as PhotoTag)} style={{ padding: 10, marginBottom: 8 }}>
        {PHOTO_TAGS.map((t) => (
          <option key={t} value={t}>
            {photoTagLabel(t)}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ display: "block", marginBottom: 8 }}
      />
      <button type="button" onClick={upload} disabled={!file || state === "saving"}>
        {state === "saving" ? "Uploading…" : "Upload photo"}
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <p style={{ color: "#5A6B60", fontSize: 13 }}>JPEG/PNG/WebP, max 5MB, stored in reference-photos.</p>
    </div>
  );
}
