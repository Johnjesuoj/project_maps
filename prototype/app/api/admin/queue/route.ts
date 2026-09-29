import { NextResponse } from "next/server";
import { listClaims, listCorrections } from "@/lib/trust";

export async function GET() {
  const [claims, corrections] = await Promise.all([listClaims(), listCorrections()]);
  return NextResponse.json({ claims, corrections });
}
