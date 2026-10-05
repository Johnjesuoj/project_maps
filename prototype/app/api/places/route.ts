import { NextResponse } from "next/server";
import { createLocation } from "@/lib/locations";
import { searchPlaces } from "@/lib/places";
import { createLocationSchema } from "@/lib/validation";

// GET /api/places?q= — OpenStreetMap candidates (not saved until imported).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  if (q.trim().length < 2) return NextResponse.json({ error: "q (min 2 chars) required" }, { status: 400 });
  try {
    return NextResponse.json(await searchPlaces(q));
  } catch (e) {
    const status = (e as { status?: number })?.status ?? 502;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Search failed" }, { status });
  }
}

// POST /api/places — import an OSM candidate as a local Location.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createLocationSchema.safeParse({
    name: body?.name,
    category: body?.category ?? "Other",
    address: body?.address ?? "",
    description: body?.osmRef ? `Imported from OpenStreetMap (${body.osmRef}).` : null,
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
