import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/locations";
import { listPhotos } from "@/lib/photos";
import { verificationLabel } from "@/components/LocationCard";
import { ShareButtons } from "@/components/ShareButtons";
import { PhotoGallery } from "@/components/PhotoGallery";

// Public share landing: `/l/[id]` — what a WhatsApp/SMS recipient opens.
export default async function ShareLandingPage({ params }: { params: { id: string } }) {
  const location = await getLocation(params.id);
  if (!location) notFound();
  const photos = await listPhotos(params.id);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 48px" }}>
      <p style={{ color: "#5A6B60" }}>📍 Shared location</p>
      <h1 style={{ fontSize: 26 }}>{location.name}</h1>
      <p style={{ color: "#5A6B60" }}>{location.address}</p>
      <p>
        <strong>How to find me:</strong> {location.finalDirections}
      </p>
      {location.lookFor && (
        <p>
          <strong>Look for:</strong> {location.lookFor}
        </p>
      )}
      <PhotoGallery photos={photos} />
      <p style={{ color: "#5A6B60", fontSize: 13 }}>✓ {verificationLabel(location.verificationStatus)}</p>
      <ShareButtons id={location.id} name={location.name} />
      <p style={{ marginTop: 16 }}>
        <Link href={`/locations/${location.id}`}>Open full profile →</Link>
      </p>
    </main>
  );
}
