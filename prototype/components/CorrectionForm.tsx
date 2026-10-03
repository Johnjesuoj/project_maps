"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPES = [
  "wrong_entrance",
  "wrong_directions",
  "wrong_photo",
  "moved",
  "blocked_road",
  "demolished",
  "wrong_landmark",
  "access_restriction",
  "other",
] as const;

export function CorrectionForm({ locationId }: { locationId: string }) {
  const router = useRouter();
  const [type, setType] = useState<string>(TYPES[0]);
  const [detail, setDetail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function submit() {
    setState("saving");
    try {
      const res = await fetch(`/api/locations/${locationId}/corrections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, detail }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      router.refresh();
    } catch {
      setState("error");
    }
  }

  if (state === "done") return <p>✓ Correction reported — pending review.</p>;

  return (
    <div style={{ border: "1px solid #2F3A41", borderRadius: 10, padding: 12, marginTop: 16 }}>
      <p style={{ margin: "0 0 8px", fontWeight: 650 }}>Report a problem</p>
      <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: 10, marginBottom: 8 }}>
        {TYPES.map((t) => (
          <option key={t} value={t}>
            {t.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <textarea
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        rows={3}
        placeholder="What is wrong? (min 5 characters)"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 8 }}
      />
      <button type="button" onClick={submit} disabled={state === "saving" || detail.trim().length < 5}>
        {state === "saving" ? "Sending…" : "Report correction"}
      </button>
      {state === "error" && <p style={{ color: "crimson" }}>Submit failed — try again.</p>}
    </div>
  );
}
