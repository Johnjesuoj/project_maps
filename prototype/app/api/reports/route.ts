import { NextResponse } from "next/server";
import { createReport, listReports } from "@/lib/reports";
import { reportSchema } from "@/lib/validation";

export async function GET() {
  return NextResponse.json(await listReports());
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const report = await createReport(parsed.data);
  return NextResponse.json(report, { status: 201 });
}
