import { NextResponse } from "next/server";
import { createOrder } from "@/lib/billing";

// LOCAL TEST ONLY — creates a stub order so the Paystack webhook flow is
// testable without checkout UI (no checkout UI until monetization is approved).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const amountKobo = typeof body.amountKobo === "number" ? body.amountKobo : 500000;
  const order = await createOrder(amountKobo);
  return NextResponse.json(order, { status: 201 });
}
