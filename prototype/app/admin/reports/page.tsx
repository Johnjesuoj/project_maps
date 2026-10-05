"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { Icon } from "@/components/Icon";

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
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 120px" }}>
      <AdminHeader title={`Abuse reports (${pending.length} pending)`} eyebrow="Safety review" />
      <div style={{ display: "grid", gap: 10 }}>
        {pending.map((r) => (
          <div key={r.id} className="instrument-card" style={{ marginTop: 0 }}>
            <p style={{ margin: "0 0 8px" }}>
              <Icon name="flag" size={16} /> <strong>{r.targetType}</strong> <code>{r.targetId}</code>
            </p>
            <p style={{ margin: "0 0 8px", color: "var(--ink-muted)" }}>{r.reason}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => decide(r.id, "dismiss")}>
                Dismiss
              </button>
              <button type="button" onClick={() => decide(r.id, "action")}>
                Mark actioned
              </button>
            </div>
          </div>
        ))}
      </div>
      {pending.length === 0 && <p style={{ color: "var(--ink-muted)" }}>No pending reports.</p>}
    </main>
  );
}
