"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Local moderation queue — open locally for now; QUBATORS_ADMIN gate lands with Auth.js.
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
    <main style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px 48px" }}>
      <p>
        <Link href="/">← Search</Link>
      </p>
      <h1>Moderation queue</h1>

      <h2>Pending claims ({pendingClaims.length})</h2>
      {pendingClaims.map((c) => (
        <div key={c.id} style={{ border: "1px solid #DCE5DD", borderRadius: 10, padding: 12, marginBottom: 8 }}>
          <p style={{ margin: 0 }}>
            <Link href={`/locations/${c.locationId}`}>{nameOf(c.locationId)}</Link>
            {c.claimantNote ? ` — “${c.claimantNote}”` : ""}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" onClick={() => decideClaim(c.id, "approve")}>
              Approve → owner-verified
            </button>
            <button type="button" onClick={() => decideClaim(c.id, "reject")}>
              Reject
            </button>
          </div>
        </div>
      ))}
      {pendingClaims.length === 0 && <p>No pending claims.</p>}

      <h2>Pending corrections ({pendingCorrections.length})</h2>
      {pendingCorrections.map((c) => (
        <div key={c.id} style={{ border: "1px solid #DCE5DD", borderRadius: 10, padding: 12, marginBottom: 8 }}>
          <p style={{ margin: 0 }}>
            <Link href={`/locations/${c.locationId}`}>{nameOf(c.locationId)}</Link> —{" "}
            <strong>{c.type.replace(/_/g, " ")}</strong>: {c.detail}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" onClick={() => decideCorrection(c.id, "confirm")}>
              Confirm
            </button>
            <button type="button" onClick={() => decideCorrection(c.id, "dismiss")}>
              Dismiss
            </button>
          </div>
        </div>
      ))}
      {pendingCorrections.length === 0 && <p>No pending corrections.</p>}
    </main>
  );
}
