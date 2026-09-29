import { promises as fs } from "node:fs";
import path from "node:path";

// Stage 3 store: JSON-file backed claims + corrections.
// Mirrors Prisma `Claim` / `Correction` (see prisma/schema.prisma).
// Admin decisions mutate `locations.json` (badge flips to owner_verified,
// confirmed corrections patch the location). Auth-gating (QUBATORS_ADMIN via
// Auth.js `requireRole`) lands with the Auth phase — these routes are open
// locally for now.

export type ClaimStatus = "pending" | "approved" | "rejected";
export type CorrectionStatus = "pending" | "confirmed" | "dismissed";

export type ClaimRecord = {
  id: string;
  locationId: string;
  claimantId: string | null;
  claimantNote: string | null;
  status: ClaimStatus;
  decidedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CorrectionRecord = {
  id: string;
  locationId: string;
  type: string;
  detail: string;
  status: CorrectionStatus;
  reporterId: string | null;
  createdAt: string;
  updatedAt: string;
};

const CLAIMS_FILE = path.join(process.cwd(), "data", "claims.json");
const CORRECTIONS_FILE = path.join(process.cwd(), "data", "corrections.json");

async function readJson<T>(file: string): Promise<T[]> {
  return JSON.parse(await fs.readFile(file, "utf-8")) as T[];
}

async function writeJson<T>(file: string, rows: T[]): Promise<void> {
  await fs.writeFile(file, JSON.stringify(rows, null, 2) + "\n", "utf-8");
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}`;
}

// --- Claims ---

export async function listClaims(status?: ClaimStatus): Promise<ClaimRecord[]> {
  const rows = await readJson<ClaimRecord>(CLAIMS_FILE);
  return status ? rows.filter((c) => c.status === status) : rows;
}

export async function createClaim(locationId: string, note?: string | null): Promise<ClaimRecord> {
  const rows = await readJson<ClaimRecord>(CLAIMS_FILE);
  const now = new Date().toISOString();
  const row: ClaimRecord = {
    id: newId("claim"),
    locationId,
    claimantId: null,
    claimantNote: note ?? null,
    status: "pending",
    decidedBy: null,
    createdAt: now,
    updatedAt: now,
  };
  rows.push(row);
  await writeJson(CLAIMS_FILE, rows);
  return row;
}

export async function decideClaim(id: string, action: "approve" | "reject"): Promise<ClaimRecord | null> {
  const rows = await readJson<ClaimRecord>(CLAIMS_FILE);
  const claim = rows.find((c) => c.id === id);
  if (!claim || claim.status !== "pending") return null;
  claim.status = action === "approve" ? "approved" : "rejected";
  claim.decidedBy = null; // filled by Auth identity later
  claim.updatedAt = new Date().toISOString();
  await writeJson(CLAIMS_FILE, rows);
  return claim;
}

// --- Corrections ---

export async function listCorrections(locationId?: string): Promise<CorrectionRecord[]> {
  const rows = await readJson<CorrectionRecord>(CORRECTIONS_FILE);
  return locationId ? rows.filter((c) => c.locationId === locationId) : rows;
}

export async function createCorrection(
  locationId: string,
  type: string,
  detail: string
): Promise<CorrectionRecord> {
  const rows = await readJson<CorrectionRecord>(CORRECTIONS_FILE);
  const now = new Date().toISOString();
  const row: CorrectionRecord = {
    id: newId("corr"),
    locationId,
    type,
    detail,
    status: "pending",
    reporterId: null,
    createdAt: now,
    updatedAt: now,
  };
  rows.push(row);
  await writeJson(CORRECTIONS_FILE, rows);
  return row;
}

export async function confirmCorrection(
  id: string,
  decision: "confirm" | "dismiss"
): Promise<CorrectionRecord | null> {
  const rows = await readJson<CorrectionRecord>(CORRECTIONS_FILE);
  const corr = rows.find((c) => c.id === id);
  if (!corr || corr.status !== "pending") return null;
  corr.status = decision === "confirm" ? "confirmed" : "dismissed";
  corr.updatedAt = new Date().toISOString();
  await writeJson(CORRECTIONS_FILE, rows);
  return corr;
}

export async function countConfirmations(locationId: string): Promise<number> {
  const rows = await readJson<CorrectionRecord>(CORRECTIONS_FILE);
  return rows.filter((c) => c.locationId === locationId && c.status === "confirmed").length;
}
