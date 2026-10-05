import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation } from "@/lib/locations";
import { listPhotos } from "@/lib/photos";
import { NavigateClient } from "@/components/NavigateClient";

// Final-approach guidance (Stitch Navigation screen): maneuver card,
// landmark checklist, arrival confirm. Steps derive from finalDirections.
export default async function NavigatePage({ params }: { params: { id: string } }) {
  const location = await getLocation(params.id);
  if (!location) notFound();
  const photos = await listPhotos(params.id);
  const steps = location.finalDirections
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1)
    .slice(0, 5);
  const cues =
    location.landmarks.length > 0
      ? location.landmarks
      : (location.lookFor ?? "").split("·").map((s) => s.trim()).filter(Boolean).slice(0, 4);

  return (
    <main className="phone-col" style={{ paddingTop: 12 }}>
      <p>
        <Link href={`/locations/${location.id}`}>← Back to profile</Link>
      </p>
      <p className="mono-label" style={{ margin: "8px 0 0" }}>
        Active navigation · Stage 3 / 5
      </p>
      <h1 style={{ fontSize: 22, margin: "4px 0 12px", fontWeight: 800 }}>{location.name}</h1>
      <NavigateClient
        locationId={location.id}
        locationName={location.name}
        steps={steps}
        cues={cues}
        photoUrl={photos[0]?.url ?? null}
      />
    </main>
  );
}
