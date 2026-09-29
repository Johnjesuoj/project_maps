import { promises as fs } from "node:fs";
import path from "node:path";

// Phase 2 store: JSON-file backed, same shape as Prisma `Location`.
// Swap to Prisma (`@prisma/client`, Postgres ILIKE) once `docker compose up -d db`
// is available — call sites (API routes, pages) already use these functions.
// NOTE: Docker is not installed in this environment, so Postgres cannot run
// locally yet. Schema + migration target remain PostgreSQL per the
// "Keep PostgreSQL" steering decision in PRD.md.

export type VerificationStatus =
  | "unverified"
  | "community_verified"
  | "resident_verified"
  | "owner_verified";

export type LocationRecord = {
  id: string;
  name: string;
  category: string;
  address: string;
  description: string | null;
  entrance: string | null;
  finalDirections: string;
  landmarks: string[];
  lookFor: string | null;
  verificationStatus: VerificationStatus;
  parentId: string | null;
  lat: number | null;
  lng: number | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "locations.json");

async function readAll(): Promise<LocationRecord[]> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as LocationRecord[];
}

async function writeAll(rows: LocationRecord[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2) + "\n", "utf-8");
}

export async function listLocations(q?: string): Promise<LocationRecord[]> {
  const rows = await readAll();
  const needle = (q ?? "").trim().toLowerCase();
  if (!needle) return rows;
  // Local equivalent of Postgres `ILIKE '%q%'` across searchable columns.
  return rows.filter((l) =>
    `${l.name} ${l.address} ${l.description ?? ""} ${l.finalDirections} ${l.lookFor ?? ""} ${(l.landmarks ?? []).join(" ")}`
      .toLowerCase()
      .includes(needle)
  );
}

export async function getLocation(id: string): Promise<LocationRecord | null> {
  const rows = await readAll();
  return rows.find((l) => l.id === id) ?? null;
}

export async function createLocation(input: {
  name: string;
  category?: string;
  address: string;
  description?: string | null;
  entrance?: string | null;
  finalDirections: string;
  landmarks?: string[];
  lookFor?: string | null;
}): Promise<LocationRecord> {
  const rows = await readAll();
  const now = new Date().toISOString();
  const row: LocationRecord = {
    id: `loc_${Date.now().toString(36)}`,
    name: input.name,
    category: input.category ?? "Other",
    address: input.address,
    description: input.description ?? null,
    entrance: input.entrance ?? null,
    finalDirections: input.finalDirections,
    landmarks: input.landmarks ?? [],
    lookFor: input.lookFor ?? null,
    verificationStatus: "unverified",
    parentId: null,
    lat: null,
    lng: null,
    createdById: null,
    createdAt: now,
    updatedAt: now,
  };
  rows.push(row);
  await writeAll(rows);
  return row;
}

export async function updateLocation(
  id: string,
  patch: Partial<Pick<LocationRecord, "description" | "entrance" | "finalDirections" | "lookFor" | "landmarks">>
): Promise<LocationRecord | null> {
  const rows = await readAll();
  const idx = rows.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  rows[idx] = { ...rows[idx], ...patch, updatedAt: new Date().toISOString() };
  await writeAll(rows);
  return rows[idx];
}

export async function setVerificationStatus(
  id: string,
  status: VerificationStatus
): Promise<LocationRecord | null> {
  const rows = await readAll();
  const idx = rows.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  rows[idx] = { ...rows[idx], verificationStatus: status, updatedAt: new Date().toISOString() };
  await writeAll(rows);
  return rows[idx];
}
