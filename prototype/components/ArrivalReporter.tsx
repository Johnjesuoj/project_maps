"use client";

import { useState } from "react";

// North-Star widget: "Did you actually arrive without calling?"
export function ArrivalReporter({ locationId }: { locationId: string }) {
  const [voted, setVoted] = useState<boolean | null>(null);

  async function vote(helpful: boolean) {
    await fetch("/api/arrivals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locationId, helpful }),
    });
    setVoted(helpful);
  }

  if (voted !== null) return <p>✓ Thanks — recorded as {voted ? "arrived" : "not arrived"}.</p>;

  return (
    <div style={{ border: "1px solid #2F3A41", borderRadius: 10, padding: 12, marginTop: 16 }}>
      <p style={{ margin: "0 0 8px", fontWeight: 650 }}>Did you find it without calling anyone?</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={() => vote(true)}>
          Yes, arrived
        </button>
        <button type="button" onClick={() => vote(false)}>
          No, got lost
        </button>
      </div>
    </div>
  );
}
