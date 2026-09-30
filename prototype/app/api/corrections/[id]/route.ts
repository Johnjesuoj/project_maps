import { NextResponse } from "next/server";
import { confirmCorrection } from "@/lib/trust";
import { getLocation, updateLocation } from "@/lib/locations";
import { sendEmail } from "@/lib/email";
import { requireRole, roleErrorResponse } from "@/lib/requireRole";
import { correctionDecisionSchema } from "@/lib/validation";

// POST /api/corrections/[id] { action: confirm|dismiss, apply?: {...} }
// Confirming with `apply` patches the location (review-based, never auto-delete).
// Moderator-only: community reports via POST /api/locations/[id]/corrections.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(["QUBATORS_ADMIN", "CONSULTANT"]);
  } catch (e) {
    return roleErrorResponse(e);
  }
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
  const location = await getLocation(correction.locationId);
  sendEmail("reporter@localhost", {
    kind: "correction-decided",
    locationName: location?.name ?? correction.locationId,
    decision: correction.status,
  }).catch(() => {});
  return NextResponse.json(correction);
}
