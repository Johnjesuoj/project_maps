import { NextResponse } from "next/server";
import { getLocation } from "@/lib/locations";
import { createClaim } from "@/lib/trust";
import { claimSchema } from "@/lib/validation";

// POST /api/locations/[id]/claim — "Is this your business? Claim this location."
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const location = await getLocation(params.id);
  if (!location) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const parsed = claimSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const claim = await createClaim(params.id, parsed.data.note ?? null);
  return NextResponse.json(claim, { status: 201 });
}
