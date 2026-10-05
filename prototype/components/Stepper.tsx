const STAGES = ["Area", "Nearby", "Final", "Spot", "Arrive"] as const;

// 5-stage precision-approach stepper (Stitch Navigation screen).
// activeIndex: 0-based stage currently in progress.
export function Stepper({ activeIndex, compact = false }: { activeIndex: number; compact?: boolean }) {
  return (
    <div>
      <div className="stepper">
        {STAGES.map((s, i) => (
          <div
            key={s}
            className={`seg${i < activeIndex ? " done" : ""}${i === activeIndex ? " active" : ""}`}
          />
        ))}
      </div>
      {!compact && (
        <div style={{ display: "flex", marginTop: 6 }}>
          {STAGES.map((s, i) => (
            <span
              key={s}
              className="mono-label"
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 10,
                color: i === activeIndex ? "var(--mint)" : "var(--ink-muted)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
