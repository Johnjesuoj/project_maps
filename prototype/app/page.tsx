"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapDisplay } from "@/components/MapDisplay";
import { PlaceRow } from "@/components/PlaceRow";
import { Icon } from "@/components/Icon";
import type { LocationRecord } from "@/lib/locations";
import type { PlaceCandidate } from "@/lib/places";

const FILTERS = ["All", "Homes", "Businesses", "Estates", "Landmarks"] as const;

function matchesFilter(l: LocationRecord, f: (typeof FILTERS)[number]): boolean {
  switch (f) {
    case "Homes":
      return ["Home", "Apartment"].includes(l.category);
    case "Businesses":
      return ["Business", "Office", "Shop", "Studio", "Venue"].includes(l.category);
    case "Estates":
      return ["Estate", "Building"].includes(l.category);
    case "Landmarks":
      return l.landmarks.length > 0;
    default:
      return true;
  }
}

export default function Page() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
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

  const filtered = rows.filter((l) => matchesFilter(l, filter));
  const mapped = rows
    .filter((l) => l.lat != null && l.lng != null)
    .map((l) => ({ id: l.id, name: l.name, lat: l.lat as number, lng: l.lng as number }));

  return (
    <main className="phone-col" style={{ paddingTop: 12 }}>
      {/* Search pill header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--surface-nested)",
          border: "1px solid var(--border)",
          borderRadius: 999,
          padding: "6px 6px 6px 14px",
        }}
      >
        <Icon name="search" size={20} />
        <input
          id="search"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Where are you going?"
          style={{ flex: 1, border: "none", background: "transparent", padding: "10px 0", fontSize: 15 }}
        />
      </div>
      {q.trim() && (
        <p className="mono-label" style={{ margin: "10px 2px 0", color: "var(--cyan)" }}>
          {q.trim()}
        </p>
      )}

      {/* Map hero */}
      <div style={{ marginTop: 12 }}>
        <MapDisplay
          height={300}
          points={mapped}
        />
      </div>

      {/* Bottom sheet */}
      <div className="sheet">
        <div className="sheet-grabber" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <p className="mono-label" style={{ margin: 0 }}>
              Ground intel · Lagos
            </p>
            <h2 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 800 }}>Nearby verified places</h2>
          </div>
          <Link
            href="/locations/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "8px 14px",
              borderRadius: 999,
              background: "var(--mint-soft)",
              color: "var(--mint)",
              fontWeight: 800,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              textDecoration: "none",
            }}
          >
            <Icon name="add_location_alt" size={16} /> Add
          </Link>
        </div>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 8 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`filter-pill${filter === f ? " active" : ""}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((l) => (
            <PlaceRow key={l.id} location={l} />
          ))}
        </div>
        {!loading && filtered.length === 0 && (
          <p style={{ color: "var(--ink-muted)" }}>No places in this view yet.</p>
        )}
        {loading && <p style={{ color: "var(--ink-muted)" }}>Scanning ground intel…</p>}

        <Link
          href="/locations/new"
          className="btn-mint"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            height: 48,
            borderRadius: 999,
            marginTop: 16,
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Explore more locations <Icon name="travel_explore" size={20} />
        </Link>
      </div>

      {/* Google candidates */}
      <h2 style={{ fontSize: 18, margin: "24px 0 10px" }}>
        <Icon name="public" size={18} /> More from Google
      </h2>
      <button type="button" onClick={searchGoogle} disabled={googleState === "loading" || q.trim().length < 2}>
        {googleState === "loading" ? "Searching Google…" : "Search Google too"}
      </button>
      {googleState === "unconfigured" && (
        <p style={{ color: "var(--ink-muted)" }}>
          Google Places needs an API key — add <code>GOOGLE_MAPS_API_KEY</code> to <code>prototype/.env</code> and
          restart the dev server.
        </p>
      )}
      {googleState === "error" && <p style={{ color: "var(--danger)" }}>Google search failed — try again.</p>}
      {googleState === "done" &&
        (google ?? []).map((p) => (
          <div key={p.googlePlaceId} style={{ background: "var(--surface-default)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginTop: 8 }}>
            <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{p.name}</p>
            <p style={{ margin: "0 0 8px", color: "var(--ink-muted)", fontSize: 14 }}>{p.address}</p>
            <button type="button" onClick={() => importPlace(p)}>
              Import as location
            </button>
          </div>
        ))}
    </main>
  );
}
