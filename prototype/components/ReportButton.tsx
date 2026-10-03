"use client";

import { useState } from "react";

export function ReportButton({
  targetType,
  targetId,
}: {
  targetType: "photo" | "alert" | "location";
  targetId: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState(false);

  async function submit() {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, reason }),
    });
    if (res.ok) {
      setDone(true);
      setOpen(false);
    }
  }

  if (done) return <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>✓ Reported</span>;
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} style={{ fontSize: 13 }}>
        Report abuse
      </button>
    );
  return (
    <span style={{ display: "inline-flex", gap: 6 }}>
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (min 5 chars)"
        style={{ padding: 6, fontSize: 13 }}
      />
      <button type="button" onClick={submit} disabled={reason.trim().length < 5} style={{ fontSize: 13 }}>
        Send
      </button>
    </span>
  );
}
