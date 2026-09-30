import { NextResponse } from "next/server";
import { markOrderPaid, upsertPayment } from "@/lib/billing";
import { PaystackProvider } from "@/lib/payments/paystack";

// POST /api/webhooks/paystack — Paystack event webhook.
// Verifies HMAC-SHA512 (`x-paystack-signature`) before touching order logic.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  const provider = new PaystackProvider();
  if (!provider.verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const event = JSON.parse(rawBody) as {
    event: string;
    data: { reference: string; status?: string; metadata?: { orderId?: string } };
  };
  const orderId = event.data.metadata?.orderId;
  if (!orderId) return NextResponse.json({ error: "Missing metadata.orderId" }, { status: 400 });

  if (event.event === "charge.success") {
    await upsertPayment({
      orderId,
      provider: provider.name,
      reference: event.data.reference,
      status: "success",
      rawPayload: event,
    });
    await markOrderPaid(orderId);
  } else {
    await upsertPayment({
      orderId,
      provider: provider.name,
      reference: event.data.reference,
      status: "failed",
      rawPayload: event,
    });
  }
  return NextResponse.json({ received: true });
}
