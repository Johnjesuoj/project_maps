import { NextResponse } from "next/server";
import { decideClaim } from "@/lib/trust";
import { setVerificationStatus } from "@/lib/locations";
import { claimDecisionSchema } from "@/lib/validation";

// POST /api/admin/claims/[id] { action: approve|reject }
// Open locally for now — QUBATORS_ADMIN `requireRole` lands with Auth.js.
export async function POST(req: Request, { params }: { params: { id: string } }) {
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
  }
  return NextResponse.json(claim);
}
