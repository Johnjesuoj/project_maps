"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/AdminHeader";
import { Icon } from "@/components/Icon";

export default function AdminQueuePage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [corrections, setCorrections] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  async function refresh() {
    const [c, l] = await Promise.all([
      fetch("/api/admin/queue").then((r) => r.json()).catch(() => ({ claims: [], corrections: [] })),
      fetch("/api/locations").then((r) => r.json()).catch(() => []),
    ]);
    setClaims(c.claims ?? []);
    setCorrections(c.corrections ?? []);
    setLocations(l ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  const nameOf = (id: string) => locations.find((l) => l.id === id)?.name ?? id;

  async function decideClaim(id: string, action: "approve" | "reject") {
    await fetch(`/api/admin/claims/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    refresh();
  }

  async function decideCorrection(id: string, action: "confirm" | "dismiss") {
    await fetch(`/api/corrections/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    refresh();
  }

  const pendingClaims = claims.filter((c) => c.status === "pending");
  const pendingCorrections = corrections.filter((c) => c.status === "pending");

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 120px" }}>
      <AdminHeader title="Moderation queue" eyebrow="Trust ops" />

      <p className="mono-label" style={{ color: "var(--ink-muted)" }}>
        Pending claims ({pendingClaims.length})
      </p>
      <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        {pendingClaims.map((c) => (
          <div key={c.id} className="instrument-card" style={{ marginTop: 0 }}>
            <p style={{ margin: "0 0 4px", fontWeight: 700 }}>
              <Icon name="verified" size={16} />{" "}
              <Link href={`/locations/${c.locationId}`}>{nameOf(c.locationId)}</Link>
            </p>
            {c.claimantNote && (
              <p style={{ margin: "0 0 8px", color: "var(--ink-muted)", fontSize: 14 }}>“{c.claimantNote}”</p>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => decideClaim(c.id, "approve")}>
                Approve → owner-verified
              </button>
              <button type="button" onClick={() => decideClaim(c.id, "reject")}>
                Reject
              </button>
            </div>
          </div>
        ))}
        {pendingClaims.length === 0 && <p style={{ color: "var(--ink-muted)" }}>No pending claims.</p>}
      </div>

      <p className="mono-label" style={{ color: "var(--ink-muted)" }}>
        Pending corrections ({pendingCorrections.length})
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {pendingCorrections.map((c) => (
          <div key={c.id} className="instrument-card" style={{ marginTop: 0 }}>
            <p style={{ margin: "0 0 8px" }}>
              <Link href={`/locations/${c.locationId}`}>{nameOf(c.locationId)}</Link> —{" "}
              <strong>{c.type.replace(/_/g, " ")}</strong>: {c.detail}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => decideCorrection(c.id, "confirm")}>
                Confirm
              </button>
              <button type="button" onClick={() => decideCorrection(c.id, "dismiss")}>
                Dismiss
              </button>
            </div>
          </div>
        ))}
        {pendingCorrections.length === 0 && <p style={{ color: "var(--ink-muted)" }}>No pending corrections.</p>}
      </div>
    </main>
  );
}
