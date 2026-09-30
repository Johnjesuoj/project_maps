import { promises as fs } from "node:fs";
import path from "node:path";

// JSON-file ledger behind the order logic (mirrors Prisma Order/Payment).
// Order logic only talks to these functions + `PaymentProvider` —
// adding Flutterwave/Stripe later means a new provider, not new order logic.

export type OrderRecord = {
  id: string;
  payerId: string | null;
  amountKobo: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

export type PaymentRecord = {
  id: string;
  orderId: string;
  provider: string;
  reference: string;
  status: "pending" | "success" | "failed";
  rawPayload: unknown;
  createdAt: string;
  updatedAt: string;
};

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");
const PAYMENTS_FILE = path.join(process.cwd(), "data", "payments.json");

async function readJson<T>(file: string): Promise<T[]> {
  return JSON.parse(await fs.readFile(file, "utf-8")) as T[];
}

async function writeJson<T>(file: string, rows: T[]): Promise<void> {
  await fs.writeFile(file, JSON.stringify(rows, null, 2) + "\n", "utf-8");
}

export async function createOrder(amountKobo: number): Promise<OrderRecord> {
  const rows = await readJson<OrderRecord>(ORDERS_FILE);
  const now = new Date().toISOString();
  const row: OrderRecord = {
    id: `ord_${Date.now().toString(36)}`,
    payerId: null,
    amountKobo,
    currency: "NGN",
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  rows.push(row);
  await writeJson(ORDERS_FILE, rows);
  return row;
}

export async function markOrderPaid(orderId: string): Promise<OrderRecord | null> {
  const rows = await readJson<OrderRecord>(ORDERS_FILE);
  const order = rows.find((o) => o.id === orderId);
  if (!order) return null;
  order.status = "paid";
  order.updatedAt = new Date().toISOString();
  await writeJson(ORDERS_FILE, rows);
  return order;
}

export async function upsertPayment(input: {
  orderId: string;
  provider: string;
  reference: string;
  status: PaymentRecord["status"];
  rawPayload: unknown;
}): Promise<PaymentRecord> {
  const rows = await readJson<PaymentRecord>(PAYMENTS_FILE);
  const existing = rows.find((p) => p.reference === input.reference);
  const now = new Date().toISOString();
  if (existing) {
    existing.status = input.status;
    existing.rawPayload = input.rawPayload;
    existing.updatedAt = now;
    await writeJson(PAYMENTS_FILE, rows);
    return existing;
  }
  const row: PaymentRecord = {
    id: `pay_${Date.now().toString(36)}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  rows.push(row);
  await writeJson(PAYMENTS_FILE, rows);
  return row;
}
