"use client";

import { useState } from "react";

type Location = {
  id: string;
  name: string;
  address: string;
  directions: string;
  lookFor: string;
  verification: string;
};

const SEED: Location[] = [
  {
    id: "buzz-studio",
    name: "BUZZ Creative Studio",
    address: "14 Example Street, Lagos",
    directions: "Enter through the second gate after the pharmacy. Inside the estate, continue straight ~100m, turn left after the large mango tree.",
    lookFor: "Blue gate · White two-storey building · BUZZ sign",
    verification: "Owner verified · Updated 3 days ago",
  },
  {
    id: "greenview-gate",
    name: "Greenview Estate — Gate B",
    address: "Greenview Estate, Lagos",
    directions: "Use Gate B today. Pass the security post and continue straight to Block A.",
    lookFor: "Security post · Green gate · Block A sign",
    verification: "Resident verified",
  },
  {
    id: "ikeja-pharmacy",
    name: "Pharmacy beside big church, Ikeja",
    address: "Ikeja, Lagos",
    directions: "Turn into the street beside XYZ Pharmacy. Keep left at the first junction.",
    lookFor: "Blue pharmacy sign · White church building",
    verification: "Community verified",
  },
];

export default function Page() {
  const [q, setQ] = useState("");
  const results = SEED.filter(
    (l) =>
      q.trim() === "" ||
      `${l.name} ${l.address} ${l.directions} ${l.lookFor}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px 48px" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
        Project Maps — Working Prototype
      </h1>
      <p style={{ margin: "0 0 16px", color: "#5A6B60" }}>
        From the road to the door. Single local page (Phase 1). App + DB run locally; no deploy.
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
        <button
          type="button"
          onClick={() => setQ("")}
          style={{
            marginTop: 12,
            border: "2px solid #0E4D2F",
            borderRadius: 14,
            padding: "13px 22px",
            fontWeight: 750,
            background: "linear-gradient(180deg, #22A065, #146B43)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Find my way
        </button>
      </div>

      <h2 style={{ fontSize: 18, margin: "20px 0 10px" }}>
        Results ({results.length})
      </h2>
      {results.map((l) => (
        <article
          key={l.id}
          style={{ background: "#fff", border: "1px solid #DCE5DD", borderRadius: 12, padding: 20, marginBottom: 12 }}
        >
          <h3 style={{ margin: "0 0 4px" }}>{l.name}</h3>
          <p style={{ margin: "0 0 8px", color: "#5A6B60", fontSize: 14 }}>{l.address}</p>
          <p style={{ margin: "0 0 6px", fontSize: 15 }}>
            <strong>Final directions:</strong> {l.directions}
          </p>
          <p style={{ margin: "0 0 6px", fontSize: 15 }}>
            <strong>Look for:</strong> {l.lookFor}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "#5A6B60" }}>✓ {l.verification}</p>
        </article>
      ))}
      {results.length === 0 && <p>No matches. Try “estate”, “pharmacy”, or “studio”.</p>}
    </main>
  );
}
