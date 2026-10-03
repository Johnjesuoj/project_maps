"use client";

import { useState } from "react";

// "Is this your business? Claim this location."
export function ClaimButton({ locationId }: { locationId: string }) {
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function submit() {
    setState("saving");
    try {
      const res = await fetch(`/api/locations/${locationId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note || null }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") return <p>✓ Claim submitted — pending review.</p>;

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 12, marginTop: 16 }}>
      <p style={{ margin: "0 0 8px", fontWeight: 650 }}>Is this your business?</p>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note (e.g. I manage this shop)"
        style={{ display: "block", width: "100%", padding: 10, marginBottom: 8 }}
      />
      <button type="button" onClick={submit} disabled={state === "saving"}>
        {state === "saving" ? "Submitting…" : "Claim this location"}
      </button>
      {state === "error" && <p style={{ color: "crimson" }}>Submit failed — try again.</p>}
    </div>
  );
}
