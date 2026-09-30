import { promises as fs } from "node:fs";
import path from "node:path";

// "Did you actually arrive?" reports (mirrors Prisma ArrivalReport).
// North-Star metric (PRD §40): can a first-timer find it without calling?

export type ArrivalRecord = {
  id: string;
  locationId: string;
  helpful: boolean;
  createdAt: string;
};

const ARRIVALS_FILE = path.join(process.cwd(), "data", "arrival_reports.json");

export async function logArrival(locationId: string, helpful: boolean): Promise<ArrivalRecord> {
  const rows = JSON.parse(await fs.readFile(ARRIVALS_FILE, "utf-8")) as ArrivalRecord[];
  const row: ArrivalRecord = {
    id: `arr_${Date.now().toString(36)}`,
    locationId,
    helpful,
    createdAt: new Date().toISOString(),
  };
  rows.push(row);
  await fs.writeFile(ARRIVALS_FILE, JSON.stringify(rows, null, 2) + "\n", "utf-8");
  return row;
}

export async function arrivalStats(locationId?: string): Promise<{
  total: number;
  helpful: number;
  rate: number | null;
}> {
  const rows = JSON.parse(await fs.readFile(ARRIVALS_FILE, "utf-8")) as ArrivalRecord[];
  const scoped = locationId ? rows.filter((r) => r.locationId === locationId) : rows;
  const helpful = scoped.filter((r) => r.helpful).length;
  return {
    total: scoped.length,
    helpful,
    rate: scoped.length === 0 ? null : Math.round((helpful / scoped.length) * 100),
  };
}
