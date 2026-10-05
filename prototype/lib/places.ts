// OpenStreetMap Nominatim — place search (replaces Google Places).
// No API key needed for light use. Usage policy: max 1 req/s, identify the
// application, cache results, and credit © OpenStreetMap contributors.

export type PlaceCandidate = {
  source: "osm";
  osmRef: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  types: string[];
};

export function placesConfigured(): boolean {
  return true;
}

export async function searchPlaces(query: string, maxResults = 5): Promise<PlaceCandidate[]> {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    limit: String(Math.min(Math.max(maxResults, 1), 10)),
    countrycodes: "ng",
    viewbox: "2.9,6.7,3.7,6.4",
    bounded: "0",
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "ProjectMaps-Prototype/1.0 (local dev; contact: admin@localhost)",
      Referer: "http://localhost:3000/",
    },
  });
  if (!res.ok) {
    const err = new Error(`OpenStreetMap search failed (${res.status})`) as Error & { status: number };
    err.status = 502;
    throw err;
  }
  const data = (await res.json()) as {
    place_id: number;
    osm_type: string;
    osm_id: number;
    name?: string;
    display_name: string;
    lat: string;
    lon: string;
    type?: string;
    class?: string;
  }[];
  return (data ?? []).map((p) => ({
    source: "osm" as const,
    osmRef: `${p.osm_type}/${p.osm_id}`,
    name: p.name || p.display_name.split(",")[0] || "Unnamed place",
    address: p.display_name,
    latitude: Number.isFinite(Number(p.lat)) ? Number(p.lat) : null,
    longitude: Number.isFinite(Number(p.lon)) ? Number(p.lon) : null,
    types: [p.class, p.type].filter((t): t is string => !!t),
  }));
}
