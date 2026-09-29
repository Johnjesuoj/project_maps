import { NextResponse } from "next/server";
import { createLocation, listLocations } from "@/lib/locations";
import { createLocationSchema } from "@/lib/validation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rows = await listLocations(searchParams.get("q") ?? "");
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createLocationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const row = await createLocation(parsed.data);
  return NextResponse.json(row, { status: 201 });
}
