import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getLocation } from "@/lib/locations";
import { createPhotoRecord } from "@/lib/photos";
import { PHOTO_TAGS, type PhotoTag } from "@/lib/photo-tags";
import { assertUploadable, getProvider, type Bucket } from "@/lib/storage";

// POST /api/uploads (multipart: file, locationId, tag, bucket?)
// Open locally for now — auth-gating lands with Auth.js.
// Limits: JPEG/PNG/WebP, max 5MB.
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Expected multipart form-data" }, { status: 400 });

  const file = form.get("file");
  const locationId = form.get("locationId");
  const tag = form.get("tag");
  const bucket = (form.get("bucket") as Bucket | null) ?? "reference-photos";

  if (!(file instanceof Blob) || typeof locationId !== "string") {
    return NextResponse.json({ error: "Fields required: file (Blob), locationId (string)" }, { status: 400 });
  }
  if (!PHOTO_TAGS.includes(tag as PhotoTag)) {
    return NextResponse.json(
      { error: `tag must be one of: ${PHOTO_TAGS.join(", ")}` },
      { status: 400 }
    );
  }
  if (bucket !== "reference-photos" && bucket !== "avatars") {
    return NextResponse.json(
      { error: "bucket must be reference-photos or avatars for now" },
      { status: 400 }
    );
  }

  const location = await getLocation(locationId);
  if (!location) return NextResponse.json({ error: "Location not found" }, { status: 404 });

  const contentType = (file as Blob).type || "application/octet-stream";
  const bytes = Buffer.from(await (file as Blob).arrayBuffer());
  try {
    assertUploadable(contentType, bytes.length);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Rejected" }, { status: 400 });
  }

  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const key = `${locationId}-${randomUUID()}.${ext}`;
  const provider = getProvider();
  await provider.putObject(bucket, key, bytes, contentType);
  const photo = await createPhotoRecord({
    locationId,
    tag: tag as PhotoTag,
    url: provider.getUrl(bucket, key),
  });
  return NextResponse.json(photo, { status: 201 });
}
