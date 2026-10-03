import Link from "next/link";
import type { LocationRecord } from "@/lib/locations";

export function verificationLabel(s: LocationRecord["verificationStatus"]): string {
  switch (s) {
    case "owner_verified":
      return "Owner verified";
    case "resident_verified":
      return "Resident verified";
    case "community_verified":
      return "Community verified";
    default:
      return "Unverified";
  }
}

export function LocationCard({ location }: { location: LocationRecord }) {
  return (
    <article
      style={{ background: "#1A2127", border: "1px solid #2F3A41", borderRadius: 12, padding: 20, marginBottom: 12 }}
    >
      <h3 style={{ margin: "0 0 4px" }}>
        <Link href={`/locations/${location.id}`}>{location.name}</Link>
      </h3>
      <p style={{ margin: "0 0 8px", color: "#8A969C", fontSize: 14 }}>{location.address}</p>
      <p style={{ margin: "0 0 6px", fontSize: 15 }}>
        <strong>Final directions:</strong> {location.finalDirections}
      </p>
      {location.lookFor && (
        <p style={{ margin: "0 0 6px", fontSize: 15 }}>
          <strong>Look for:</strong> {location.lookFor}
        </p>
      )}
      <p style={{ margin: 0, fontSize: 13, color: "#8A969C" }}>✓ {verificationLabel(location.verificationStatus)}</p>
    </article>
  );
}
