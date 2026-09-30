import { NextResponse } from "next/server";
import { decideClaim } from "@/lib/trust";
import { getLocation, setVerificationStatus } from "@/lib/locations";
import { sendEmail } from "@/lib/email";
import { requireRole, roleErrorResponse } from "@/lib/requireRole";
import { claimDecisionSchema } from "@/lib/validation";

// POST /api/admin/claims/[id] { action: approve|reject } — QUBATORS_ADMIN only.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole(["QUBATORS_ADMIN"]);
  } catch (e) {
    return roleErrorResponse(e);
  }
  const body = await req.json().catch(() => null);
  const parsed = claimDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const claim = await decideClaim(params.id, parsed.data.action);
  if (!claim) {
    return NextResponse.json({ error: "Claim not found or already decided" }, { status: 404 });
  }
  if (claim.status === "approved") {
    // Badge flip: approving a claim marks the location owner-verified.
    await setVerificationStatus(claim.locationId, "owner_verified");
    const location = await getLocation(claim.locationId);
    sendEmail("owner@localhost", {
      kind: "claim-approved",
      locationName: location?.name ?? claim.locationId,
    }).catch(() => {});
  }
  return NextResponse.json(claim);
}
