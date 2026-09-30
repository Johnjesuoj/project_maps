"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminMetricsPage() {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return <main style={{ padding: 32 }}>Loading metrics…</main>;

  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px 48px" }}>
      <p>
        <Link href="/">← Search</Link> · <Link href="/admin/claims">Claims</Link> ·{" "}
        <Link href="/admin/reports">Reports</Link>
      </p>
      <h1>Metrics</h1>

      <h2>Locations ({data.locations.total})</h2>
      <p>
        Public in search: {data.locations.public} · By verification:{" "}
        {Object.entries(data.locations.byVerification)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" · ")}
      </p>

      <h2>Claims ({data.claims.total})</h2>
      <p>
        Pending: {data.claims.pending} · Approved: {data.claims.approved}
      </p>

      <h2>Corrections ({data.corrections.total})</h2>
      <p>
        Pending: {data.corrections.pending} · Confirmed: {data.corrections.confirmed} · Correction rate:{" "}
        {data.corrections.total === 0
          ? "n/a"
          : `${Math.round((data.corrections.confirmed / data.corrections.total) * 100)}%`}
      </p>

      <h2>Alerts ({data.alerts.total})</h2>
      <p>Active: {data.alerts.active}</p>

      <h2>Abuse reports ({data.reports.total})</h2>
      <p>Pending: {data.reports.pending}</p>

      <h2>Arrivals (North Star)</h2>
      <p>
        Reports: {data.arrivals.total} · Helpful: {data.arrivals.helpful} · Success rate:{" "}
        {data.arrivals.rate === null ? "n/a — no reports yet" : `${data.arrivals.rate}%`}
      </p>
    </main>
  );
}
