"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LocationCard } from "@/components/LocationCard";
import { MapDisplay } from "@/components/MapDisplay";
import { Icon } from "@/components/Icon";
import type { LocationRecord } from "@/lib/locations";
import type { PlaceCandidate } from "@/lib/places";

export default function Page() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [google, setGoogle] = useState<PlaceCandidate[] | null>(null);
  const [googleState, setGoogleState] = useState<"idle" | "loading" | "error" | "unconfigured" | "done">("idle");

  async function searchGoogle() {
    setGoogleState("loading");
    try {
      const res = await fetch(`/api/places?q=${encodeURIComponent(q)}`);
      if (res.status === 503) {
        setGoogleState("unconfigured");
        return;
      }
      if (!res.ok) throw new Error();
      setGoogle(await res.json());
      setGoogleState("done");
    } catch {
      setGoogleState("error");
    }
  }

  async function importPlace(p: PlaceCandidate) {
    const res = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: p.name,
        address: p.address,
        googlePlaceId: p.googlePlaceId,
        finalDirections: "Directions not yet added — claim and describe this place.",
      }),
    });
    if (res.ok) {
      const row = await res.json();
      router.push(`/locations/${row.id}`);
    }
  }
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
      <div className="hero-nocturne">
        <p className="mono-label" style={{ margin: "0 0 8px" }}>
          <Icon name="my_location" size={14} /> Live tactical intel · Lagos
        </p>
        <h1 style={{ fontSize: 30, margin: "0 0 8px", letterSpacing: "-0.02em", fontWeight: 800 }}>
          From the road to the door
        </h1>
        <p style={{ margin: "0 0 16px", color: "var(--ink-muted)" }}>
          Maps get you close. We get you there — verified final-approach guides with photos and landmarks.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/locations/new">＋ Create a location</Link>
          <a href="#search">
            <Icon name="turn_sharp_right" size={16} /> Navigate
          </a>
        </div>
      </div>

      <h2 style={{ fontSize: 18, margin: "24px 0 10px" }}>
        <Icon name="map" size={18} /> Nearby on the map
      </h2>
      <MapDisplay
        points={rows
          .filter((l) => l.lat != null && l.lng != null)
          .map((l) => ({ id: l.id, name: l.name, lat: l.lat as number, lng: l.lng as number }))}
      />

      <div id="search" style={{ background: "var(--surface-default)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginTop: 20 }}>
        <label htmlFor="search" style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-muted)" }}>
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
            border: "1px solid var(--border)",
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

      <h2 style={{ fontSize: 18, margin: "24px 0 10px" }}>More from Google</h2>
      <button type="button" onClick={searchGoogle} disabled={googleState === "loading" || q.trim().length < 2}>
        {googleState === "loading" ? "Searching Google…" : "Search Google too"}
      </button>
      {googleState === "unconfigured" && (
        <p style={{ color: "var(--ink-muted)" }}>
          Google Places needs an API key — add <code>GOOGLE_MAPS_API_KEY</code> to <code>prototype/.env</code> and
          restart the dev server.
        </p>
      )}
      {googleState === "error" && <p style={{ color: "crimson" }}>Google search failed — try again.</p>}
      {googleState === "done" &&
        (google ?? []).map((p) => (
          <div key={p.googlePlaceId} style={{ background: "var(--surface-default)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginTop: 8 }}>
            <p style={{ margin: "0 0 4px", fontWeight: 650 }}>{p.name}</p>
            <p style={{ margin: "0 0 8px", color: "var(--ink-muted)", fontSize: 14 }}>{p.address}</p>
            <button type="button" onClick={() => importPlace(p)}>
              Import as location
            </button>
          </div>
        ))}
    </main>
  );
}
