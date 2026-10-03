import { verificationLabel } from "./LocationCard";
import type { LocationRecord } from "@/lib/locations";
import { Icon } from "./Icon";

// Evidence-based confidence line — no numeric score (maps PRD §27).
// Nocturne instrument styling: mono uppercase micro-label.
export function ConfidenceLine({
  location,
  confirmations,
}: {
  location: LocationRecord;
  confirmations: number;
}) {
  const updated = new Date(location.updatedAt).toLocaleDateString();
  return (
    <p className="mono-label" style={{ margin: "8px 0" }}>
      <Icon name="verified" size={14} /> {verificationLabel(location.verificationStatus)} · Updated {updated} · {confirmations} community
      confirmation{confirmations === 1 ? "" : "s"}
    </p>
  );
}
