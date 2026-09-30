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

export const LOCATION_LEVELS = [
  "estate",
  "block",
  "building",
  "floor",
  "unit",
  "shop",
  "place",
] as const;

export type LocationLevel = (typeof LOCATION_LEVELS)[number];

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
  level: LocationLevel;
  lat: number | null;
  lng: number | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "locations.json");

async function readAll(): Promise<LocationRecord[]> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const rows = JSON.parse(raw) as LocationRecord[];
  // Backfill for seed rows written before `level` existed.
  for (const r of rows) {
    if (!r.level) r.level = "place";
  }
  return rows;
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
  parentId?: string | null;
  level?: LocationLevel;
}): Promise<LocationRecord> {
  const rows = await readAll();
  if (input.parentId) {
    if (!rows.some((l) => l.id === input.parentId)) {
      throw new Error("Parent location not found");
    }
  }
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
    parentId: input.parentId ?? null,
    level: input.level ?? "place",
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

export async function getChildren(id: string): Promise<LocationRecord[]> {
  const rows = await readAll();
  return rows.filter((l) => l.parentId === id);
}

// Breadcrumb from root → node. Empty when the node is top-level.
export async function getBreadcrumb(id: string): Promise<LocationRecord[]> {
  const rows = await readAll();
  const byId = new Map(rows.map((l) => [l.id, l]));
  const chain: LocationRecord[] = [];
  const seen = new Set<string>();
  let cur = byId.get(id);
  while (cur?.parentId && !seen.has(cur.id)) {
    seen.add(cur.id);
    const parent = byId.get(cur.parentId);
    if (!parent) break;
    chain.unshift(parent);
    cur = parent;
  }
  return chain;
}

// Re-parent with cycle guard: a node cannot sit under itself or its descendant.
export async function setParent(id: string, parentId: string | null): Promise<LocationRecord | null> {
  const rows = await readAll();
  const idx = rows.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  if (parentId === id) throw new Error("A location cannot be its own parent");
  if (parentId) {
    if (!rows.some((l) => l.id === parentId)) throw new Error("Parent location not found");
    const byId = new Map(rows.map((l) => [l.id, l]));
    let cur = byId.get(parentId);
    const seen = new Set<string>();
    while (cur && !seen.has(cur.id)) {
      if (cur.id === id) throw new Error("Cycle rejected: parent is a descendant of this location");
      seen.add(cur.id);
      cur = cur.parentId ? byId.get(cur.parentId) : undefined;
    }
  }
  rows[idx] = { ...rows[idx], parentId, updatedAt: new Date().toISOString() };
  await writeAll(rows);
  return rows[idx];
}
