import { NextResponse } from "next/server";
import { decideReport } from "@/lib/reports";
import { reportDecisionSchema } from "@/lib/validation";

// POST /api/reports/[id] { action: dismiss|action } — review-based, nothing auto-deletes.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = reportDecisionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const report = await decideReport(params.id, parsed.data.action);
  if (!report) {
    return NextResponse.json({ error: "Report not found or already decided" }, { status: 404 });
  }
  return NextResponse.json(report);
}
