import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/locations";
import { listPhotos } from "@/lib/photos";
import { verificationLabel } from "@/components/LocationCard";
import { ShareButtons } from "@/components/ShareButtons";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ArrivalReporter } from "@/components/ArrivalReporter";
import { ReportButton } from "@/components/ReportButton";

// Public share landing: `/l/[id]` — what a WhatsApp/SMS recipient opens.
// This is the private-link path: full content here, masked on the profile
// page. `approved` stays masked everywhere until Auth roles land.
export default async function ShareLandingPage({ params }: { params: { id: string } }) {
  const location = await getLocation(params.id);
  if (!location) notFound();
  if (location.visibility === "approved") {
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 48px" }}>
        <p>Private residence — detailed directions available through shared link.</p>
        <p style={{ color: "var(--ink-muted)", fontSize: 13 }}>Access is limited to approved people.</p>
      </main>
    );
  }
  const photos = await listPhotos(params.id);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 48px" }}>
      <p style={{ color: "var(--ink-muted)" }}>📍 Shared location</p>
      <h1 style={{ fontSize: 26 }}>{location.name}</h1>
      <p style={{ color: "var(--ink-muted)" }}>{location.address}</p>
      <p>
        <strong>How to find me:</strong> {location.finalDirections}
      </p>
      {location.lookFor && (
        <p>
          <strong>Look for:</strong> {location.lookFor}
        </p>
      )}
      <PhotoGallery photos={photos} />
      <p style={{ color: "var(--ink-muted)", fontSize: 13 }}>✓ {verificationLabel(location.verificationStatus)}</p>
      <p>
        <ReportButton targetType="location" targetId={location.id} />
      </p>
      <ShareButtons id={location.id} name={location.name} />
      <ArrivalReporter locationId={location.id} />
      <p style={{ marginTop: 16 }}>
        <Link href={`/locations/${location.id}`}>Open full profile →</Link>
      </p>
    </main>
  );
}
