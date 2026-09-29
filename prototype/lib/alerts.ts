import { promises as fs } from "node:fs";
import path from "node:path";
import type { AlertStatus, AlertType } from "./alert-types";

// Stage 5 store: JSON-file backed road/location alerts.
// Mirrors Prisma `Alert`. Expiry is lazy: every read sweeps past-due
// actives to `expired` (a cron calling the same `expireDueAlerts()`
// replaces this when a scheduler exists).

export { ALERT_TYPES } from "./alert-types";
export type { AlertStatus, AlertType };

export type AlertRecord = {
  id: string;
  locationId: string | null;
  roadHint: string | null;
  type: AlertType;
  detail: string;
  reportedAt: string;
  expiresAt: string;
  status: AlertStatus;
  confirms: number;
  reporterId: string | null;
  createdAt: string;
  updatedAt: string;
};

const ALERTS_FILE = path.join(process.cwd(), "data", "alerts.json");
const DEFAULT_TTL_HOURS = 4;

async function readAll(): Promise<AlertRecord[]> {
  return JSON.parse(await fs.readFile(ALERTS_FILE, "utf-8")) as AlertRecord[];
}

async function writeAll(rows: AlertRecord[]): Promise<void> {
  await fs.writeFile(ALERTS_FILE, JSON.stringify(rows, null, 2) + "\n", "utf-8");
}

export async function expireDueAlerts(): Promise<number> {
  const rows = await readAll();
  const now = Date.now();
  let changed = 0;
  for (const a of rows) {
    if (a.status === "active" && new Date(a.expiresAt).getTime() <= now) {
      a.status = "expired";
      a.updatedAt = new Date().toISOString();
      changed++;
    }
  }
  if (changed) await writeAll(rows);
  return changed;
}

export async function listAlerts(opts?: { locationId?: string; includePast?: boolean }): Promise<AlertRecord[]> {
  await expireDueAlerts();
  const rows = await readAll();
  return rows
    .filter((a) => (!opts?.locationId || a.locationId === opts.locationId))
    .filter((a) => (opts?.includePast ? true : a.status === "active"))
    .sort((a, b) => +new Date(b.reportedAt) - +new Date(a.reportedAt));
}

export async function createAlert(input: {
  locationId?: string | null;
  roadHint?: string | null;
  type: AlertType;
  detail: string;
  ttlHours?: number;
}): Promise<AlertRecord> {
  const rows = await readAll();
  const now = new Date();
  const ttl = input.ttlHours ?? DEFAULT_TTL_HOURS;
  const row: AlertRecord = {
    id: `alr_${Date.now().toString(36)}`,
    locationId: input.locationId ?? null,
    roadHint: input.roadHint ?? null,
    type: input.type,
    detail: input.detail,
    reportedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttl * 3600_000).toISOString(),
    status: "active",
    confirms: 0,
    reporterId: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  rows.push(row);
  await writeAll(rows);
  return row;
}

// "Still happening" bumps confirmations and extends expiry; "Cleared" closes it.
export async function decideAlert(id: string, action: "confirm" | "clear"): Promise<AlertRecord | null> {
  const rows = await readAll();
  const alert = rows.find((a) => a.id === id);
  if (!alert || alert.status !== "active") return null;
  if (action === "confirm") {
    alert.confirms += 1;
    alert.expiresAt = new Date(Date.now() + DEFAULT_TTL_HOURS * 3600_000).toISOString();
  } else {
    alert.status = "cleared";
  }
  alert.updatedAt = new Date().toISOString();
  await writeAll(rows);
  return alert;
}
