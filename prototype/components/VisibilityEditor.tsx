"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LocationRecord } from "@/lib/locations";

export function VisibilityEditor({ location }: { location: LocationRecord }) {
  const router = useRouter();
  const [visibility, setVisibility] = useState(location.visibility);
  const [saved, setSaved] = useState(false);

  async function save() {
    await fetch(`/api/locations/${location.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility }),
    });
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div style={{ border: "1px solid #2F3A41", borderRadius: 10, padding: 12, marginTop: 16 }}>
      <p style={{ margin: "0 0 8px", fontWeight: 650 }}>Who can discover this place?</p>
      <select value={visibility} onChange={(e) => setVisibility(e.target.value as LocationRecord["visibility"])} style={{ padding: 10, marginBottom: 8 }}>
        <option value="public">Public — listed in search</option>
        <option value="private_link">Private link — hidden from search, openable via shared link</option>
        <option value="approved">Approved people — hidden everywhere until Auth roles land</option>
      </select>
      <button type="button" onClick={save}>
        Save visibility
      </button>
      {saved && <span> ✓</span>}
    </div>
  );
}
