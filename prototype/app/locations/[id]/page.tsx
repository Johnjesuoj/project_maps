import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/locations";
import { countConfirmations } from "@/lib/trust";
import { ConfidenceLine } from "@/components/ConfidenceLine";
import { ShareButtons } from "@/components/ShareButtons";
import { ClaimButton } from "@/components/ClaimButton";
import { OwnerEditForm } from "@/components/OwnerEditForm";
import { CorrectionForm } from "@/components/CorrectionForm";

export default async function LocationDetailPage({ params }: { params: { id: string } }) {
  const location = await getLocation(params.id);
  if (!location) notFound();
  const confirmations = await countConfirmations(params.id);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 48px" }}>
      <p>
        <Link href="/">← Search</Link> · <Link href="/admin/claims">Moderation queue</Link>
      </p>
      <h1 style={{ fontSize: 26, margin: "8px 0" }}>{location.name}</h1>
      <p style={{ color: "#5A6B60" }}>{location.address} · {location.category}</p>
      <ConfidenceLine location={location} confirmations={confirmations} />
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
      <ShareButtons id={location.id} name={location.name} />
      <ClaimButton locationId={location.id} />
      <OwnerEditForm location={location} />
      <CorrectionForm locationId={location.id} />
    </main>
  );
}
