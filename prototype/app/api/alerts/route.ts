import { NextResponse } from "next/server";
import { createAlert, listAlerts } from "@/lib/alerts";
import { alertSchema } from "@/lib/validation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rows = await listAlerts({ locationId: searchParams.get("locationId") ?? undefined });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = alertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  if (!parsed.data.locationId && !parsed.data.roadHint) {
    return NextResponse.json(
      { error: "One of locationId or roadHint is required" },
      { status: 400 }
    );
  }
  const alert = await createAlert(parsed.data);
  return NextResponse.json(alert, { status: 201 });
}
