import { createHmac, randomUUID } from "node:crypto";
import type {
  ChargeInput,
  ChargeResult,
  InstallmentInput,
  InstallmentSchedule,
  PaymentProvider,
} from "../payments";

// Paystack provider (test mode locally — no live charges).
// Real `initialize` calls go out only when PAYSTACK_SECRET_KEY is set;
// otherwise a deterministic stub reference is returned so order logic
// stays testable offline.

export class PaystackProvider implements PaymentProvider {
  name = "paystack";

  private get secretKey(): string | undefined {
    return process.env.PAYSTACK_SECRET_KEY;
  }

  async createCharge(input: ChargeInput): Promise<ChargeResult> {
    if (!this.secretKey) {
      return { reference: `stub_${input.orderId}_${Date.now().toString(36)}`, provider: this.name };
    }
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.secretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: input.amountKobo,
        email: input.email,
        reference: `ord_${input.orderId}_${Date.now().toString(36)}`,
        callback_url: input.callbackUrl,
      }),
    });
    const data = (await res.json()) as {
      status: boolean;
      data?: { reference: string; authorization_url: string };
    };
    if (!res.ok || !data.status || !data.data) {
      throw new Error("Paystack initialize failed");
    }
    return {
      reference: data.data.reference,
      authorizationUrl: data.data.authorization_url,
      provider: this.name,
    };
  }

  async createInstallmentPlan(input: InstallmentInput): Promise<InstallmentSchedule> {
    // Split evenly (last part takes the remainder). Charging per part is
    // orchestrated by order logic through createCharge — no provider rewrite.
    const base = Math.floor(input.amountKobo / input.parts);
    const parts = Array.from({ length: input.parts }, (_, i) => ({
      dueIndex: i + 1,
      amountKobo: i === input.parts - 1 ? input.amountKobo - base * (input.parts - 1) : base,
    }));
    return { reference: `plan_${input.orderId}_${randomUUID().slice(0, 8)}`, parts };
  }

  verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
    if (!this.secretKey || !signature) return false;
    const digest = createHmac("sha512", this.secretKey).update(rawBody).digest("hex");
    return digest === signature;
  }

  async getPaymentStatus(reference: string): Promise<"pending" | "success" | "failed"> {
    if (!this.secretKey || reference.startsWith("stub_")) return "pending";
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });
    if (!res.ok) return "failed";
    const data = (await res.json()) as { status: boolean; data?: { status: string } };
    return data.data?.status === "success" ? "success" : "failed";
  }
}

// Test helper: HMAC-SHA512 of a raw body (mirrors Paystack's signing).
export function signTestWebhook(rawBody: string, secret: string): string {
  return createHmac("sha512", secret).update(rawBody).digest("hex");
}
