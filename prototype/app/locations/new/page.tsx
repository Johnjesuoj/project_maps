"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = ["Identify", "Reach", "Visuals", "Confirm"] as const;
const LEVELS = ["estate", "block", "building", "floor", "unit", "shop", "place"] as const;

export default function NewLocationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [address, setAddress] = useState("");
  const [finalDirections, setFinalDirections] = useState("");
  const [lookFor, setLookFor] = useState("");
  const [entrance, setEntrance] = useState("");
  const [parentId, setParentId] = useState("");
  const [level, setLevel] = useState<string>("place");
  const [visibility, setVisibility] = useState<string>("public");
  const [existing, setExisting] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then((rows) => setExisting(rows.map((l: { id: string; name: string }) => ({ id: l.id, name: l.name }))))
      .catch(() => {});
  }, []);

  async function submit() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          address,
          entrance: entrance || null,
          finalDirections,
          lookFor: lookFor || null,
          landmarks: [],
          parentId: parentId || null,
          level,
          visibility,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ? "Validation failed — check required fields." : `Save failed (${res.status})`);
      }
      const row = await res.json();
      router.push(`/locations/${row.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
      setSaving(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 48px" }}>
      <h1 style={{ fontSize: 24 }}>Create a location</h1>
      <p style={{ color: "#5A6B60" }}>
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </p>

      {step === 0 && (
        <section style={{ display: "grid", gap: 12 }}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Oje's Studio" style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }} />
          </label>
          <label>
            Category
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Home, Business, Estate…" style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }} />
          </label>
          <label>
            Address
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="14 Example Street, Lagos" style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }} />
          </label>
          <label>
            Inside another place? (optional)
            <select value={parentId} onChange={(e) => setParentId(e.target.value)} style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }}>
              <option value="">Top-level place</option>
              {existing.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Level
            <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label>
            Visibility
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }}>
              <option value="public">Public</option>
              <option value="private_link">Private link</option>
              <option value="approved">Approved people</option>
            </select>
          </label>
        </section>
      )}

      {step === 1 && (
        <section style={{ display: "grid", gap: 12 }}>
          <label>
            Final directions (from the main road to the door)
            <textarea value={finalDirections} onChange={(e) => setFinalDirections(e.target.value)} rows={4} placeholder="Enter through the second gate after the pharmacy…" style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }} />
          </label>
          <label>
            Entrance info
            <input value={entrance} onChange={(e) => setEntrance(e.target.value)} placeholder="Main entrance through the black gate" style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }} />
          </label>
        </section>
      )}

      {step === 2 && (
        <section style={{ display: "grid", gap: 12 }}>
          <label>
            What should visitors look for?
            <input value={lookFor} onChange={(e) => setLookFor(e.target.value)} placeholder="Blue gate · White building · Sign" style={{ display: "block", width: "100%", padding: 10, marginTop: 4 }} />
          </label>
          <p style={{ color: "#5A6B60", fontSize: 14 }}>Photo uploads land in Phase 4 (R2/MinIO). Describe visuals in text for now.</p>
        </section>
      )}

      {step === 3 && (
        <section>
          <h2>Confirm</h2>
          <p><strong>{name || "(no name)"}</strong> — {address || "(no address)"}</p>
          <p>{finalDirections || "(no directions)"}</p>
          {lookFor && <p>Look for: {lookFor}</p>}
          {error && <p style={{ color: "crimson" }}>{error}</p>}
        </section>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {step > 0 && <button type="button" onClick={() => setStep(step - 1)}>Back</button>}
        {step < STEPS.length - 1 && <button type="button" onClick={() => setStep(step + 1)}>Next</button>}
        {step === STEPS.length - 1 && (
          <button type="button" onClick={submit} disabled={saving}>
            {saving ? "Saving…" : "Create location"}
          </button>
        )}
      </div>
    </main>
  );
}
