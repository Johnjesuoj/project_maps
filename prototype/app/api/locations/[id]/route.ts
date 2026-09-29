import { NextResponse } from "next/server";
import { getLocation, updateLocation } from "@/lib/locations";
import { listPhotos } from "@/lib/photos";
import { patchLocationSchema } from "@/lib/validation";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const row = await getLocation(params.id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const photos = await listPhotos(params.id);
  return NextResponse.json({ ...row, photos });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = patchLocationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const row = await updateLocation(params.id, parsed.data);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}
