"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  async function refresh() {
    const r = await fetch("/api/reports").then((x) => x.json()).catch(() => []);
    setReports(r);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function decide(id: string, action: "dismiss" | "action") {
    await fetch(`/api/reports/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    refresh();
  }

  const pending = reports.filter((r) => r.status === "pending");

  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px 48px" }}>
      <p>
        <Link href="/">← Search</Link> · <Link href="/admin/claims">Claims</Link> ·{" "}
        <Link href="/admin/metrics">Metrics</Link>
      </p>
      <h1>Abuse reports ({pending.length} pending)</h1>
      {pending.map((r) => (
        <div key={r.id} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 12, marginBottom: 8 }}>
          <p style={{ margin: 0 }}>
            <strong>{r.targetType}</strong> <code>{r.targetId}</code> — {r.reason}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" onClick={() => decide(r.id, "dismiss")}>
              Dismiss
            </button>
            <button type="button" onClick={() => decide(r.id, "action")}>
              Mark actioned
            </button>
          </div>
        </div>
      ))}
      {pending.length === 0 && <p>No pending reports.</p>}
    </main>
  );
}
