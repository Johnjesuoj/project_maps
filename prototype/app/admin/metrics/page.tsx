"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="instrument-card" style={{ marginTop: 0 }}>
      <p className="mono-label" style={{ margin: "0 0 4px", color: "var(--ink-muted)", fontSize: 11 }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>{value}</p>
      {sub && <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-muted)" }}>{sub}</p>}
    </div>
  );
}

export default function AdminMetricsPage() {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 120px" }}>
      <AdminHeader title="Metrics" eyebrow="Network health" />
      {!data && <p style={{ color: "var(--ink-muted)" }}>Loading metrics…</p>}
      {data && (
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <StatCard
            label="Locations"
            value={String(data.locations.total)}
            sub={`Public in search: ${data.locations.public} · ${Object.entries(data.locations.byVerification)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ")}`}
          />
          <StatCard
            label="Arrivals · North Star"
            value={data.arrivals.rate === null ? "n/a" : `${data.arrivals.rate}%`}
            sub={`${data.arrivals.helpful}/${data.arrivals.total} arrived without calling`}
          />
          <StatCard
            label="Claims"
            value={String(data.claims.pending)}
            sub={`${data.claims.approved}/${data.claims.total} approved`}
          />
          <StatCard
            label="Corrections"
            value={String(data.corrections.pending)}
            sub={
              data.corrections.total === 0
                ? "none reported yet"
                : `${data.corrections.confirmed}/${data.corrections.total} confirmed`
            }
          />
          <StatCard label="Active alerts" value={String(data.alerts.active)} sub={`${data.alerts.total} reported total`} />
          <StatCard label="Abuse reports" value={String(data.reports.pending)} sub={`${data.reports.total} total`} />
        </div>
      )}
    </main>
  );
}
