import { verificationLabel } from "./LocationCard";
import type { LocationRecord } from "@/lib/locations";

// Evidence-based confidence line — no numeric score (maps PRD §27).
export function ConfidenceLine({
  location,
  confirmations,
}: {
  location: LocationRecord;
  confirmations: number;
}) {
  const updated = new Date(location.updatedAt).toLocaleDateString();
  return (
    <p style={{ fontSize: 13, color: "#5A6B60" }}>
      ✓ {verificationLabel(location.verificationStatus)} · Updated {updated} · {confirmations} community
      confirmation{confirmations === 1 ? "" : "s"}
    </p>
  );
}
