import { NextResponse } from "next/server";
import { getLocation } from "@/lib/locations";
import { createCorrection, listCorrections } from "@/lib/trust";
import { correctionSchema } from "@/lib/validation";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const location = await getLocation(params.id);
  if (!location) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(await listCorrections(params.id));
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const location = await getLocation(params.id);
  if (!location) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const parsed = correctionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const correction = await createCorrection(params.id, parsed.data.type, parsed.data.detail);
  return NextResponse.json(correction, { status: 201 });
}
