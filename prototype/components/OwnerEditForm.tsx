"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LocationRecord } from "@/lib/locations";

// Owner maintenance form: photos/directions/entrance/contact upkeep (text fields for now).
export function OwnerEditForm({ location }: { location: LocationRecord }) {
  const router = useRouter();
  const [finalDirections, setFinalDirections] = useState(location.finalDirections);
  const [entrance, setEntrance] = useState(location.entrance ?? "");
  const [lookFor, setLookFor] = useState(location.lookFor ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setState("saving");
    try {
      const res = await fetch(`/api/locations/${location.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalDirections, entrance: entrance || null, lookFor: lookFor || null }),
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
      <p style={{ margin: "0 0 8px", fontWeight: 650 }}>Maintain this location</p>
      <label>
        Final directions
        <textarea value={finalDirections} onChange={(e) => setFinalDirections(e.target.value)} rows={3} style={{ display: "block", width: "100%", padding: 10, margin: "4px 0 8px" }} />
      </label>
      <label>
        Entrance
        <input value={entrance} onChange={(e) => setEntrance(e.target.value)} style={{ display: "block", width: "100%", padding: 10, margin: "4px 0 8px" }} />
      </label>
      <label>
        Look for
        <input value={lookFor} onChange={(e) => setLookFor(e.target.value)} style={{ display: "block", width: "100%", padding: 10, margin: "4px 0 8px" }} />
      </label>
      <button type="button" onClick={save} disabled={state === "saving"}>
        {state === "saving" ? "Saving…" : "Save changes"}
      </button>
      {state === "saved" && <p>✓ Saved.</p>}
      {state === "error" && <p style={{ color: "crimson" }}>Save failed — try again.</p>}
    </div>
  );
}
