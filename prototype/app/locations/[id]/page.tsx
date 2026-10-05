import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/locations";
import { listPhotos } from "@/lib/photos";
import { countConfirmations } from "@/lib/trust";
import { listAlerts } from "@/lib/alerts";
import { getBreadcrumb, getChildren } from "@/lib/locations";
import { verificationLabel } from "@/components/LocationCard";
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
import { Stepper } from "@/components/Stepper";
import { Icon } from "@/components/Icon";

function stepsOf(directions: string): string[] {
  return directions
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1)
    .slice(0, 5);
}

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

  // Privacy masking for non-public places (unchanged rule).
  if (location.visibility !== "public") {
    return (
      <main className="phone-col">
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

  const steps = stepsOf(location.finalDirections);
  const heroPhoto = photos.find((p) => p.tag === "building") ?? photos[0];

  return (
    <main className="phone-col" style={{ paddingTop: 12 }}>
      {/* Hero visual */}
      <div
        style={{
          position: "relative",
          height: 240,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--border)",
          background: "radial-gradient(300px 160px at 80% 0%, var(--mint-soft), transparent 70%), var(--surface-nested)",
        }}
      >
        {heroPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroPhoto.url} alt={location.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="location_city" size={64} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, var(--bg-canvas) 4%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span className="frosted-pill mono-label" style={{ fontSize: 11 }}>
            <Icon name="verified" size={14} /> {verificationLabel(location.verificationStatus)}
          </span>
        </div>
      </div>

      {/* Title & meta */}
      {breadcrumb.length > 0 && (
        <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "12px 0 0" }}>
          Inside:{" "}
          {breadcrumb.map((b) => (
            <span key={b.id}>
              <Link href={`/locations/${b.id}`}>{b.name}</Link> →{" "}
            </span>
          ))}
          {location.name}
        </p>
      )}
      <h1 style={{ fontSize: 24, margin: "8px 0 2px", fontWeight: 800 }}>{location.name}</h1>
      <p style={{ margin: "0 0 4px", color: "var(--cyan)", fontWeight: 600, fontSize: 14 }}>{location.category}</p>
      <p style={{ margin: 0, color: "var(--ink-muted)", fontSize: 14 }}>
        <Icon name="near_me" size={14} /> {location.address}
      </p>
      <p style={{ marginTop: 8 }}>
        <ReportButton targetType="location" targetId={location.id} />
      </p>

      {/* Action row */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Link
          href={`/locations/${location.id}/navigate`}
          className="btn-mint"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            height: 48,
            borderRadius: 999,
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          <Icon name="turn_sharp_right" size={20} /> Navigate
        </Link>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ShareButtons id={location.id} name={location.name} />
        </div>
      </div>

      {/* Stepper */}
      <div className="instrument-card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span className="mono-label" style={{ color: "var(--ink-muted)" }}>Precision approach route</span>
          <span className="mono-label">Stage 3 / 5</span>
        </div>
        <Stepper activeIndex={2} />
      </div>

      {/* How to find us */}
      {location.description && (
        <div className="instrument-card">
          <p className="card-eyebrow">
            <Icon name="explore" size={16} /> How to find us
          </p>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{location.description}</p>
        </div>
      )}

      {/* Final approach steps */}
      <div className="instrument-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p className="card-eyebrow" style={{ color: "var(--cyan)", margin: 0 }}>
            <Icon name="alt_route" size={16} /> Final approach
          </p>
          <span className="mono-label" style={{ color: "var(--ink-muted)", fontSize: 10 }}>
            Last stretch
          </span>
        </div>
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: i === steps.length - 1 ? "var(--mint-soft)" : "var(--surface-nested)",
                  color: i === steps.length - 1 ? "var(--mint)" : "var(--cyan)",
                  fontWeight: 800,
                  fontSize: 13,
                  flexShrink: 0,
                  border: "1px solid var(--border)",
                }}
              >
                {i + 1}
              </span>
              <p style={{ margin: "4px 0 0", fontSize: 14, lineHeight: 1.5 }}>{s}</p>
            </div>
          ))}
        </div>
        {location.entrance && (
          <p style={{ margin: "12px 0 0", fontSize: 14 }}>
            <strong>Entrance:</strong> {location.entrance}
          </p>
        )}
      </div>

      {/* Look for */}
      {(photos.length > 0 || location.lookFor || location.landmarks.length > 0) && (
        <div className="instrument-card">
          <p className="card-eyebrow" style={{ color: "var(--amber)" }}>
            <Icon name="visibility" size={16} /> Look for
          </p>
          <PhotoGallery photos={photos} />
          {photos.length === 0 && location.lookFor && <p style={{ margin: "8px 0 0" }}>{location.lookFor}</p>}
          {photos.length === 0 && location.landmarks.length > 0 && (
            <p style={{ color: "var(--ink-muted)", margin: "8px 0 0" }}>{location.landmarks.join(" · ")}</p>
          )}
        </div>
      )}

      {/* Current conditions */}
      <div className="instrument-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p className="card-eyebrow" style={{ margin: 0 }}>
            <Icon name="sensors" size={16} /> Current conditions
          </p>
          <span className="mono-label" style={{ color: "var(--ink-muted)", fontSize: 10 }}>Live radar</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <AlertList alerts={alerts} />
        </div>
        <AlertComposer locationId={location.id} />
      </div>

      {/* Verified by */}
      <div className="instrument-card">
        <p className="card-eyebrow" style={{ color: "var(--cyan)" }}>
          <Icon name="verified_user" size={16} /> Verified by
        </p>
        <p className="mono-label" style={{ margin: "0 0 4px", color: "var(--ink-muted)", fontSize: 11 }}>
          {verificationLabel(location.verificationStatus)} · Updated{" "}
          {new Date(location.updatedAt).toLocaleDateString()} · {confirmations} confirmation
          {confirmations === 1 ? "" : "s"}
        </p>
        {children.length > 0 && (
          <p style={{ margin: "8px 0 0", fontSize: 14 }}>
            <Link href={`/locations/${location.id}/tree`}>
              Navigate inside ({children.length} place{children.length === 1 ? "" : "s"}) →
            </Link>
          </p>
        )}
      </div>

      {/* Maintain / footer flows (functional, unchanged logic) */}
      <ClaimButton locationId={location.id} />
      <OwnerEditForm location={location} />
      <LandmarkEditor locationId={location.id} initial={location.landmarks} />
      <VisibilityEditor location={location} />
      <PhotoUploader locationId={location.id} />
      <CorrectionForm locationId={location.id} />
    </main>
  );
}
