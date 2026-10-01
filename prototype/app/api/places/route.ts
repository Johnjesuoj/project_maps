import { NextResponse } from "next/server";
import { createLocation } from "@/lib/locations";
import { placesConfigured, searchPlaces } from "@/lib/places";
import { createLocationSchema } from "@/lib/validation";

// GET /api/places?q= — Google Places candidates (not saved until imported).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  if (q.trim().length < 2) return NextResponse.json({ error: "q (min 2 chars) required" }, { status: 400 });
  if (!placesConfigured()) {
    return NextResponse.json(
      { error: "Google Places not configured — set GOOGLE_MAPS_API_KEY in prototype/.env" },
      { status: 503 }
    );
  }
  try {
    return NextResponse.json(await searchPlaces(q));
  } catch (e) {
    const status = (e as { status?: number })?.status ?? 502;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Places failed" }, { status });
  }
}

// POST /api/places — import a Google candidate as a local Location.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createLocationSchema.safeParse({
    name: body?.name,
    category: body?.category ?? "Other",
    address: body?.address ?? "",
    description: body?.googlePlaceId ? `Imported from Google Places (${body.googlePlaceId}).` : null,
    finalDirections: body?.finalDirections ?? "Directions not yet added — claim and describe this place.",
    landmarks: [],
    lookFor: null,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const row = await createLocation(parsed.data);
    return NextResponse.json(row, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Import failed" }, { status: 400 });
  }
}
