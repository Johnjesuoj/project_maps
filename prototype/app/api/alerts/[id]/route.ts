import { NextResponse } from "next/server";
import { decideAlert } from "@/lib/alerts";
import { alertDecisionSchema } from "@/lib/validation";

// POST /api/alerts/[id] { action: confirm|clear }
// confirm = "Still happening" (bumps confirms, extends expiry).
// clear = "Cleared".
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = alertDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const alert = await decideAlert(params.id, parsed.data.action);
  if (!alert) {
    return NextResponse.json({ error: "Alert not found or no longer active" }, { status: 404 });
  }
  return NextResponse.json(alert);
}
