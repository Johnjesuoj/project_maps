"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LocationCard } from "@/components/LocationCard";
import type { LocationRecord } from "@/lib/locations";

export default function Page() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/locations?q=${encodeURIComponent(q)}`);
        setRows(await res.json());
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px 48px" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
        Project Maps — Working Prototype
      </h1>
      <p style={{ margin: "0 0 16px", color: "#5A6B60" }}>
        From the road to the door. Phase 2: search → create → view → share. App + DB run locally; no deploy.
      </p>
      <p style={{ margin: "0 0 16px" }}>
        <Link href="/locations/new">+ Create a location</Link>
      </p>

      <div style={{ background: "#fff", border: "1px solid #DCE5DD", borderRadius: 12, padding: 20 }}>
        <label htmlFor="search" style={{ fontSize: 13, fontWeight: 600, color: "#5A6B60" }}>
          Where are you going?
        </label>
        <input
          id="search"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. pharmacy beside the big church in Ikeja"
          style={{
            display: "block",
            width: "100%",
            marginTop: 8,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #DCE5DD",
            fontSize: 15,
          }}
        />
      </div>

      <h2 style={{ fontSize: 18, margin: "20px 0 10px" }}>
        Results ({rows.length}){loading ? "…" : ""}
      </h2>
      {rows.map((l) => (
        <LocationCard key={l.id} location={l} />
      ))}
      {!loading && rows.length === 0 && <p>No matches. Try “estate”, “pharmacy”, or create a new location.</p>}
    </main>
  );
}
