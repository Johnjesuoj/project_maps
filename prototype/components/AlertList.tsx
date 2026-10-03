"use client";

import { useRouter } from "next/navigation";
import type { AlertRecord } from "@/lib/alerts";
import { ReportButton } from "./ReportButton";

function ageInMinutes(iso: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

export function AlertList({ alerts }: { alerts: AlertRecord[] }) {
  const router = useRouter();
  if (alerts.length === 0) return <p style={{ color: "var(--ink-muted)" }}>No active alerts. 🟢</p>;

  async function act(id: string, action: "confirm" | "clear") {
    await fetch(`/api/alerts/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    router.refresh();
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {alerts.map((a) => (
        <div key={a.id} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 12 }}>
          <p style={{ margin: "0 0 4px" }}>
            🚧 <strong>{a.type}</strong> — {a.detail}
          </p>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--ink-muted)" }}>
            Reported {ageInMinutes(a.reportedAt)}m ago
            {a.roadHint ? ` · ${a.roadHint}` : ""} · {a.confirms} confirmation{a.confirms === 1 ? "" : "s"}
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button type="button" onClick={() => act(a.id, "confirm")}>
              Still happening
            </button>
            <button type="button" onClick={() => act(a.id, "clear")}>
              Cleared
            </button>
            <ReportButton targetType="alert" targetId={a.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
