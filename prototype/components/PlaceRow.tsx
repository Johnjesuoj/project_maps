import Link from "next/link";
import type { LocationRecord } from "@/lib/locations";
import { verificationLabel } from "./LocationCard";
import { Icon } from "./Icon";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function badgeColor(status: LocationRecord["verificationStatus"]): string {
  switch (status) {
    case "owner_verified":
      return "var(--mint)";
    case "resident_verified":
    case "community_verified":
      return "var(--cyan)";
    default:
      return "var(--ink-muted)";
  }
}

// Stitch Home-Map place row: avatar node, name, address, badge, chevron.
export function PlaceRow({ location }: { location: LocationRecord }) {
  return (
    <Link
      href={`/locations/${location.id}`}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: 12,
        borderRadius: 16,
        background: "var(--surface-nested)",
        border: "1px solid var(--border)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div className="avatar-node">
        {initials(location.name)}
        {location.verificationStatus !== "unverified" && <span className="tick">✓</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {location.name}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--ink-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {location.address}
        </p>
        <p className="mono-label" style={{ margin: "6px 0 0", fontSize: 11, color: badgeColor(location.verificationStatus) }}>
          <Icon name={location.verificationStatus === "unverified" ? "help_outline" : "verified"} size={13} />{" "}
          {verificationLabel(location.verificationStatus)}
        </p>
      </div>
      <Icon name="chevron_right" size={20} />
    </Link>
  );
}
