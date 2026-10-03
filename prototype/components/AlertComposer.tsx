"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ALERT_TYPES } from "@/lib/alert-types";

export function AlertComposer({ locationId }: { locationId?: string }) {
  const router = useRouter();
  const [type, setType] = useState<string>(ALERT_TYPES[0]);
  const [detail, setDetail] = useState("");
  const [roadHint, setRoadHint] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function submit() {
    setState("saving");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: locationId ?? null,
          roadHint: roadHint || null,
          type,
          detail,
        }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setDetail("");
      setRoadHint("");
      router.refresh();
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
    }
  }

  return (
    <div style={{ border: "1px solid #2F3A41", borderRadius: 10, padding: 12, marginTop: 16 }}>
      <p style={{ margin: "0 0 8px", fontWeight: 650 }}>Report a road condition</p>
      <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: 10, marginBottom: 8 }}>
        {ALERT_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      {!locationId && (
        <input
          value={roadHint}
          onChange={(e) => setRoadHint(e.target.value)}
          placeholder="Road (e.g. XYZ Road, Ikeja)"
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 8 }}
        />
      )}
      <textarea
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        rows={2}
        placeholder="What is happening? (min 5 characters)"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 8 }}
      />
      <button type="button" onClick={submit} disabled={state === "saving" || detail.trim().length < 5}>
        {state === "saving" ? "Reporting…" : "Report alert"}
      </button>
      {state === "done" && <p>✓ Reported.</p>}
      {state === "error" && <p style={{ color: "crimson" }}>Report failed — try again.</p>}
    </div>
  );
}
