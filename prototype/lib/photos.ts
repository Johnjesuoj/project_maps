import { promises as fs } from "node:fs";
import path from "node:path";
import type { PhotoTag } from "./photo-tags";

// Mirrors Prisma `LocationPhoto` (tag ∈ turn_here|entrance|building|parking).

export type { PhotoTag };

export type PhotoRecord = {
  id: string;
  locationId: string;
  tag: PhotoTag;
  url: string;
  createdById: string | null;
  createdAt: string;
};

const PHOTOS_FILE = path.join(process.cwd(), "data", "location_photos.json");

export async function listPhotos(locationId: string): Promise<PhotoRecord[]> {
  const rows = JSON.parse(await fs.readFile(PHOTOS_FILE, "utf-8")) as PhotoRecord[];
  return rows.filter((p) => p.locationId === locationId);
}

export async function createPhotoRecord(input: {
  locationId: string;
  tag: PhotoTag;
  url: string;
}): Promise<PhotoRecord> {
  const rows = JSON.parse(await fs.readFile(PHOTOS_FILE, "utf-8")) as PhotoRecord[];
  const row: PhotoRecord = {
    id: `pho_${Date.now().toString(36)}`,
    locationId: input.locationId,
    tag: input.tag,
    url: input.url,
    createdById: null,
    createdAt: new Date().toISOString(),
  };
  rows.push(row);
  await fs.writeFile(PHOTOS_FILE, JSON.stringify(rows, null, 2) + "\n", "utf-8");
  return row;
}
