import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/locations";
import { listPhotos } from "@/lib/photos";
import { countConfirmations } from "@/lib/trust";
import { listAlerts } from "@/lib/alerts";
import { getBreadcrumb, getChildren } from "@/lib/locations";
import { ConfidenceLine } from "@/components/ConfidenceLine";
import { ShareButtons } from "@/components/ShareButtons";
import { ClaimButton } from "@/components/ClaimButton";
import { OwnerEditForm } from "@/components/OwnerEditForm";
import { CorrectionForm } from "@/components/CorrectionForm";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PhotoUploader } from "@/components/PhotoUploader";
import { LandmarkEditor } from "@/components/LandmarkEditor";
import { AlertComposer } from "@/components/AlertComposer";
import { AlertList } from "@/components/AlertList";
import { VisibilityEditor } from "@/components/VisibilityEditor";
import { ReportButton } from "@/components/ReportButton";

export default async function LocationDetailPage({ params }: { params: { id: string } }) {
  const location = await getLocation(params.id);
  if (!location) notFound();
  const [confirmations, photos, alerts, breadcrumb, children] = await Promise.all([
    countConfirmations(params.id),
    listPhotos(params.id),
    listAlerts({ locationId: params.id }),
    getBreadcrumb(params.id),
    getChildren(params.id),
  ]);

  // Privacy: non-public places are masked on the profile page.
  // private_link opens via the shared link (/l/[id]); approved stays
  // masked until Auth roles land.
  if (location.visibility !== "public") {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 48px" }}>
        <p>
          <Link href="/">← Search</Link>
        </p>
        <h1 style={{ fontSize: 26 }}>{location.name}</h1>
        <p>Private residence — detailed directions available through shared link.</p>
        {location.visibility === "private_link" && (
          <p>
            <Link href={`/l/${location.id}`}>Open shared link →</Link>
          </p>
        )}
        <VisibilityEditor location={location} />
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 48px" }}>
      <p>
        <Link href="/">← Search</Link> · <Link href="/admin/claims">Moderation queue</Link> ·{" "}
        <Link href="/admin/metrics">Metrics</Link> · <Link href="/admin/reports">Reports</Link>
      </p>
      {breadcrumb.length > 0 && (
        <p style={{ fontSize: 14, color: "#5A6B60" }}>
          Inside:{" "}
          {breadcrumb.map((b) => (
            <span key={b.id}>
              <Link href={`/locations/${b.id}`}>{b.name}</Link> →{" "}
            </span>
          ))}
          {location.name} · <Link href={`/locations/${location.id}/tree`}>drill down →</Link>
        </p>
      )}
      {breadcrumb.length === 0 && children.length > 0 && (
        <p style={{ fontSize: 14 }}>
          <Link href={`/locations/${location.id}/tree`}>
            Navigate inside ({children.length} place{children.length === 1 ? "" : "s"}) →
          </Link>
        </p>
      )}
      <h1 style={{ fontSize: 26, margin: "8px 0" }}>{location.name}</h1>
      <p style={{ color: "#5A6B60" }}>{location.address} · {location.category}</p>
      <ConfidenceLine location={location} confirmations={confirmations} />
      <p>
        <ReportButton targetType="location" targetId={location.id} />
      </p>
      {location.description && <p>{location.description}</p>}
      <h2>Final directions</h2>
      <p>{location.finalDirections}</p>
      {location.entrance && (
        <>
          <h2>Entrance</h2>
          <p>{location.entrance}</p>
        </>
      )}
      {location.lookFor && (
        <>
          <h2>Look for</h2>
          <p>{location.lookFor}</p>
        </>
      )}
      {location.landmarks.length > 0 && (
        <p style={{ color: "#5A6B60" }}>Landmarks: {location.landmarks.join(", ")}</p>
      )}
      <PhotoGallery photos={photos} />
      <h2>Current conditions</h2>
      <AlertList alerts={alerts} />
      <AlertComposer locationId={location.id} />
      <ShareButtons id={location.id} name={location.name} />
      <ClaimButton locationId={location.id} />
      <OwnerEditForm location={location} />
      <LandmarkEditor locationId={location.id} initial={location.landmarks} />
      <VisibilityEditor location={location} />
      <PhotoUploader locationId={location.id} />
      <CorrectionForm locationId={location.id} />
    </main>
  );
}
