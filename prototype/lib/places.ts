// Google Places API (New) — Text Search.
// Key comes from GOOGLE_MAPS_API_KEY (server-side only, never shipped to the client).
// Needs a key with "Places API (New)" enabled (billing-enabled project).
// Without a key, callers get a clear 503 and the app keeps working on local data.

export type PlaceCandidate = {
  source: "google";
  googlePlaceId: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  types: string[];
};

export function placesConfigured(): boolean {
  return !!process.env.GOOGLE_MAPS_API_KEY;
}

export async function searchPlaces(query: string, maxResults = 5): Promise<PlaceCandidate[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    const err = new Error("Google Places not configured — set GOOGLE_MAPS_API_KEY") as Error & {
      status: number;
    };
    err.status = 503;
    throw err;
  }
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.types",
    },
    body: JSON.stringify({ textQuery: `${query} Lagos, Nigeria`, maxResultCount: maxResults }),
  });
  if (!res.ok) {
    const err = new Error(`Places API failed (${res.status})`) as Error & { status: number };
    err.status = 502;
    throw err;
  }
  const data = (await res.json()) as {
    places?: {
      id: string;
      displayName?: { text: string };
      formattedAddress?: string;
      location?: { latitude: number; longitude: number };
      types?: string[];
    }[];
  };
  return (data.places ?? []).map((p) => ({
    source: "google" as const,
    googlePlaceId: p.id,
    name: p.displayName?.text ?? "Unnamed place",
    address: p.formattedAddress ?? "",
    latitude: p.location?.latitude ?? null,
    longitude: p.location?.longitude ?? null,
    types: p.types ?? [],
  }));
}
