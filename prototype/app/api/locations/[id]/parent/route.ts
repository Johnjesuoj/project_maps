import { NextResponse } from "next/server";
import { setParent } from "@/lib/locations";
import { reparentSchema } from "@/lib/validation";

// POST /api/locations/[id]/parent { parentId: string | null }
// Cycle-guarded re-parenting.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const parsed = reparentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const row = await setParent(params.id, parsed.data.parentId);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Re-parent failed" }, { status: 400 });
  }
}
