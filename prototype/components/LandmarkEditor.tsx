"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LANDMARK_TAXONOMY, normalizeLandmarks } from "@/lib/landmarks";

export function LandmarkEditor({
  locationId,
  initial,
}: {
  locationId: string;
  initial: string[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initial);
  const [freeText, setFreeText] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function toggle(v: string) {
    setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  }

  async function save() {
    setState("saving");
    const extra = freeText.split(",").map((s) => s.trim()).filter(Boolean);
    const landmarks = normalizeLandmarks([...selected, ...extra]);
    try {
      const res = await fetch(`/api/locations/${locationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landmarks }),
      });
      if (!res.ok) throw new Error();
      setState("saved");
      router.refresh();
    } catch {
      setState("error");
    }
  }

  return (
    <div style={{ border: "1px solid #2F3A41", borderRadius: 10, padding: 12, marginTop: 16 }}>
      <p style={{ margin: "0 0 8px", fontWeight: 650 }}>Landmarks</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {LANDMARK_TAXONOMY.map((t) => (
          <label key={t} style={{ border: "1px solid #2F3A41", borderRadius: 999, padding: "6px 12px", cursor: "pointer", background: selected.includes(t) ? "rgba(42, 255, 216, 0.12)" : "#232B32" }}>
            <input type="checkbox" checked={selected.includes(t)} onChange={() => toggle(t)} /> {t}
          </label>
        ))}
      </div>
      <input
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        placeholder="Custom landmarks, comma-separated (e.g. blue kiosk, mango tree)"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 8 }}
      />
      <button type="button" onClick={save} disabled={state === "saving"}>
        {state === "saving" ? "Saving…" : "Save landmarks"}
      </button>
      {state === "saved" && <p>✓ Saved.</p>}
      {state === "error" && <p style={{ color: "crimson" }}>Save failed — try again.</p>}
    </div>
  );
}
