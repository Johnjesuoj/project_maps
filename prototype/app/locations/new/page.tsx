"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

const STEPS = ["Identify", "Reach", "Visuals", "Confirm"] as const;
const LEVELS = ["estate", "block", "building", "floor", "unit", "shop", "place"] as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 13, fontWeight: 700 }}>
      <span className="mono-label" style={{ display: "block", marginBottom: 6, fontSize: 11 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle = { display: "block", width: "100%", padding: 12, fontSize: 15 } as const;

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
    <main className="phone-col" style={{ paddingTop: 12 }}>
      <p className="mono-label" style={{ margin: "0 0 4px" }}>
        <Icon name="add_location_alt" size={14} /> Ground verification flow
      </p>
      <h1 style={{ fontSize: 24, margin: "0 0 12px", fontWeight: 800 }}>Create a location</h1>

      {/* Wizard progress */}
      <div className="stepper" style={{ marginBottom: 4 }}>
        {STEPS.map((_, i) => (
          <div key={i} className={`seg${i < step ? " done" : ""}${i === step ? " active" : ""}`} />
        ))}
      </div>
      <p className="mono-label" style={{ color: "var(--ink-muted)", fontSize: 11, margin: "0 0 12px" }}>
        Step {step + 1} of {STEPS.length} · {STEPS[step]}
      </p>

      {step === 0 && (
        <section className="instrument-card" style={{ marginTop: 0, display: "grid", gap: 14 }}>
          <Field label="Place name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Oje's Studio" style={inputStyle} />
          </Field>
          <Field label="Category">
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Home, Business, Estate…" style={inputStyle} />
          </Field>
          <Field label="Address">
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="14 Example Street, Lagos" style={inputStyle} />
          </Field>
          <Field label="Inside another place? (optional)">
            <select value={parentId} onChange={(e) => setParentId(e.target.value)} style={inputStyle}>
              <option value="">Top-level place</option>
              {existing.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Level">
            <select value={level} onChange={(e) => setLevel(e.target.value)} style={inputStyle}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Visibility">
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={inputStyle}>
              <option value="public">Public</option>
              <option value="private_link">Private link</option>
              <option value="approved">Approved people</option>
            </select>
          </Field>
        </section>
      )}

      {step === 1 && (
        <section className="instrument-card" style={{ marginTop: 0, display: "grid", gap: 14 }}>
          <Field label="Final directions — main road to the door">
            <textarea value={finalDirections} onChange={(e) => setFinalDirections(e.target.value)} rows={4} placeholder="Enter through the second gate after the pharmacy…" style={inputStyle} />
          </Field>
          <Field label="Entrance info">
            <input value={entrance} onChange={(e) => setEntrance(e.target.value)} placeholder="Main entrance through the black gate" style={inputStyle} />
          </Field>
        </section>
      )}

      {step === 2 && (
        <section className="instrument-card" style={{ marginTop: 0, display: "grid", gap: 14 }}>
          <Field label="What should visitors look for?">
            <input value={lookFor} onChange={(e) => setLookFor(e.target.value)} placeholder="Blue gate · White building · Sign" style={inputStyle} />
          </Field>
          <p style={{ color: "var(--ink-muted)", fontSize: 13, margin: 0 }}>
            Photos can be added on the profile after creation.
          </p>
        </section>
      )}

      {step === 3 && (
        <section className="instrument-card" style={{ marginTop: 0 }}>
          <p className="card-eyebrow">
            <Icon name="task_alt" size={16} /> Confirm dossier
          </p>
          <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 17 }}>{name || "(no name)"}</p>
          <p style={{ margin: "0 0 6px", color: "var(--ink-muted)", fontSize: 14 }}>{address || "(no address)"}</p>
          <p style={{ margin: "0 0 6px" }}>{finalDirections || "(no directions)"}</p>
          {lookFor && <p style={{ margin: 0 }}>Look for: {lookFor}</p>}
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
        </section>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button type="button" onClick={() => setStep(step + 1)} className="btn-mint" style={{ flex: 1, height: 48 }}>
            Next <Icon name="arrow_forward" size={18} />
          </button>
        )}
        {step === STEPS.length - 1 && (
          <button type="button" onClick={submit} disabled={saving} className="btn-mint" style={{ flex: 1, height: 48 }}>
            <Icon name="check_circle" size={18} /> {saving ? "Saving…" : "Create location"}
          </button>
        )}
      </div>
    </main>
  );
}
