// Payment provider abstraction (PRD.md Phase 6).
// Paystack is primary (Nigeria-first). Flutterwave/Stripe plug in later by
// implementing `PaymentProvider` — order logic never touches a provider directly.

export type ChargeInput = {
  orderId: string;
  amountKobo: number;
  email: string;
  callbackUrl?: string;
};

export type ChargeResult = {
  reference: string;
  authorizationUrl?: string;
  provider: string;
};

export type InstallmentInput = {
  orderId: string;
  amountKobo: number;
  parts: number;
};

export type InstallmentSchedule = {
  reference: string;
  parts: { dueIndex: number; amountKobo: number }[];
};

export interface PaymentProvider {
  name: string;
  createCharge(input: ChargeInput): Promise<ChargeResult>;
  createInstallmentPlan(input: InstallmentInput): Promise<InstallmentSchedule>;
  verifyWebhookSignature(rawBody: string, signature: string | null): boolean;
  getPaymentStatus(reference: string): Promise<"pending" | "success" | "failed">;
}
