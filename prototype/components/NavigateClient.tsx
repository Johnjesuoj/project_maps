"use client";

import { useState } from "react";
import { Stepper } from "./Stepper";
import { Icon } from "./Icon";

export function NavigateClient({
  locationId,
  locationName,
  steps,
  cues,
  photoUrl,
}: {
  locationId: string;
  locationName: string;
  steps: string[];
  cues: string[];
  photoUrl: string | null;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [arrived, setArrived] = useState(false);

  function toggleCue(c: string) {
    setChecked((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  }

  async function confirmArrival() {
    await fetch("/api/arrivals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locationId, helpful: true }),
    });
    setArrived(true);
  }

  const immediate = steps[0] ?? "Head to the destination.";
  const next = steps[1] ?? null;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Stepper activeIndex={2} />

      {/* Maneuver directive card */}
      <div className="instrument-card" style={{ marginTop: 0 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "var(--mint)",
              color: "var(--mint-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 16px var(--mint-soft)",
            }}
          >
            <Icon name="straight" size={34} />
          </div>
          <div>
            <p className="mono-label" style={{ margin: 0, color: "var(--cyan)", fontSize: 11 }}>
              Immediate action
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 17, fontWeight: 700, lineHeight: 1.4 }}>{immediate}</p>
          </div>
        </div>
        {next && (
          <div
            style={{
              marginTop: 12,
              background: "var(--surface-nested)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "10px 12px",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Icon name="turn_left" size={20} />
            <div>
              <p className="mono-label" style={{ margin: 0, fontSize: 10, color: "var(--ink-muted)" }}>
                Next step
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 14 }}>{next}</p>
            </div>
          </div>
        )}
        {steps.length > 2 && (
          <ol style={{ margin: "12px 0 0", paddingLeft: 20, fontSize: 14, color: "var(--ink-muted)" }}>
            {steps.slice(2).map((s, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {s}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Visual landmark */}
      <div className="instrument-card" style={{ marginTop: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p className="card-eyebrow" style={{ margin: 0 }}>
            <Icon name="visibility" size={16} /> Visual landmark
          </p>
          <span className="mono-label" style={{ fontSize: 10, color: "var(--cyan)" }}>Turn here</span>
        </div>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={`Landmark near ${locationName}`} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />
        ) : (
          <p style={{ color: "var(--ink-muted)", fontSize: 14, margin: "8px 0 0" }}>
            No landmark photo yet — look for: {cues.join(" · ") || "the entrance"}
          </p>
        )}
      </div>

      {/* Spot-target checklist */}
      {cues.length > 0 && (
        <div className="instrument-card" style={{ marginTop: 0 }}>
          <p className="card-eyebrow" style={{ color: "var(--ink-muted)" }}>Spot target checklist</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {cues.map((c) => {
              const on = checked.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCue(c)}
                  className={`check-chip${on ? " on" : ""}`}
                >
                  <Icon name={on ? "check_circle" : "radio_button_unchecked"} size={16} /> {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Arrival */}
      {!arrived ? (
        <button type="button" onClick={confirmArrival} className="btn-mint" style={{ height: 56, fontSize: 16, borderRadius: 999 }}>
          <Icon name="check_circle" size={22} /> Confirm entrance / This is it
        </button>
      ) : (
        <div className="instrument-card" style={{ marginTop: 0, textAlign: "center" }}>
          <p className="mono-label" style={{ margin: 0 }}>
            <Icon name="task_alt" size={16} /> Target reached · arrival logged
          </p>
        </div>
      )}
    </div>
  );
}
