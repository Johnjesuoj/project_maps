// S3-compatible storage behind one interface (PRD.md Phase 4).
// Local now: filesystem adapter writing under `public/uploads/<bucket>/`
// so files are web-accessible at `/uploads/<bucket>/<key>` with no cloud.
// Production later: R2 / Supabase Storage implementing the same two functions
// (swap `getProvider()` — call sites stay unchanged).
// NOTE: Docker/MinIO is not up yet, hence the fs adapter, not the MinIO shim.

import { promises as fs } from "node:fs";
import path from "node:path";

export const BUCKETS = [
  "reference-photos",
  "design-attachments",
  "progress-photos",
  "portfolios",
  "avatars",
] as const;

export type Bucket = (typeof BUCKETS)[number];

export type StorageProvider = {
  putObject(bucket: Bucket, key: string, body: Buffer, contentType: string): Promise<void>;
  getUrl(bucket: Bucket, key: string): string;
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function assertUploadable(contentType: string, size: number): void {
  if (!ALLOWED_TYPES.has(contentType)) {
    throw new Error(`Unsupported file type: ${contentType}. Use JPEG, PNG, or WebP.`);
  }
  if (size > MAX_UPLOAD_BYTES) {
    throw new Error(`File too large: ${size} bytes. Max is ${MAX_UPLOAD_BYTES} bytes.`);
  }
}

const fsProvider: StorageProvider = {
  async putObject(bucket, key, body) {
    const dir = path.join(process.cwd(), "public", "uploads", bucket);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, key), body);
  },
  getUrl(bucket, key) {
    return `/uploads/${bucket}/${key}`;
  },
};

export function getProvider(): StorageProvider {
  // Future: `if (process.env.S3_ENDPOINT) return s3Provider;`
  return fsProvider;
}
