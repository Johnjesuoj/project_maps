import { NextResponse } from "next/server";
import { confirmCorrection } from "@/lib/trust";
import { updateLocation } from "@/lib/locations";
import { correctionDecisionSchema } from "@/lib/validation";

// POST /api/corrections/[id] { action: confirm|dismiss, apply?: {...} }
// Confirming with `apply` patches the location (review-based, never auto-delete).
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = correctionDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const correction = await confirmCorrection(params.id, parsed.data.action);
  if (!correction) {
    return NextResponse.json({ error: "Correction not found or already decided" }, { status: 404 });
  }
  if (correction.status === "confirmed" && parsed.data.apply) {
    await updateLocation(correction.locationId, parsed.data.apply);
  }
  return NextResponse.json(correction);
}
