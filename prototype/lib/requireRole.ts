import { NextResponse } from "next/server";
import { auth, type AppRole } from "@/auth";

// Server-side role gate for route handlers / server actions.
// Use in every admin mutation; community actions stay open per PRD roles.
export async function requireRole(roles: AppRole[]): Promise<{ id?: string; role: AppRole }> {
  const session = await auth();
  const role = session?.user?.role;
  if (!role) {
    const err = new Error("Unauthorized") as Error & { status: number };
    err.status = 401;
    throw err;
  }
  if (!roles.includes(role)) {
    const err = new Error("Forbidden") as Error & { status: number };
    err.status = 403;
    throw err;
  }
  return { id: session?.user?.id, role };
}

export function roleErrorResponse(e: unknown) {
  const status = (e as { status?: number })?.status ?? 500;
  const error = e instanceof Error ? e.message : "Failed";
  return NextResponse.json({ error }, { status });
}
