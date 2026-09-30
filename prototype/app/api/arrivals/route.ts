import { NextResponse } from "next/server";
import { getLocation } from "@/lib/locations";
import { logArrival } from "@/lib/arrival";
import { arrivalSchema } from "@/lib/validation";

// POST /api/arrivals { locationId, helpful } — "Did you arrive successfully?"
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = arrivalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const location = await getLocation(parsed.data.locationId);
  if (!location) return NextResponse.json({ error: "Location not found" }, { status: 404 });
  const report = await logArrival(parsed.data.locationId, parsed.data.helpful);
  return NextResponse.json(report, { status: 201 });
}
