import Link from "next/link";
import { notFound } from "next/navigation";
import { getBreadcrumb, getChildren, getLocation } from "@/lib/locations";

// Drill-down navigator: Estate → Block → Unit (maps PRD §29–§31).
export default async function LocationTreePage({ params }: { params: { id: string } }) {
  const location = await getLocation(params.id);
  if (!location) notFound();
  const [breadcrumb, children] = await Promise.all([
    getBreadcrumb(params.id),
    getChildren(params.id),
  ]);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 48px" }}>
      <p>
        {breadcrumb.map((b) => (
          <span key={b.id}>
            <Link href={`/locations/${b.id}/tree`}>{b.name}</Link> →{" "}
          </span>
        ))}
        <strong>{location.name}</strong>
      </p>
      <h1 style={{ fontSize: 24 }}>{location.name}</h1>
      <p style={{ color: "var(--ink-muted)" }}>
        {location.level} · {location.address}
      </p>
      <p>{location.finalDirections}</p>

      <h2>Inside this place ({children.length})</h2>
      {children.map((c) => (
        <Link key={c.id} href={`/locations/${c.id}/tree`} className="place-card" style={{ marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {c.name}{" "}
              <span style={{ color: "var(--ink-muted)", fontSize: 12, fontWeight: 400 }}>· {c.level}</span>
            </p>
            <p style={{ margin: "1px 0 0", fontSize: 12, color: "var(--ink-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {c.finalDirections}
            </p>
          </div>
          <span style={{ flexShrink: 0, display: "inline-flex" }}>›</span>
        </Link>
      ))}
      {children.length === 0 && <p style={{ color: "var(--ink-muted)" }}>Nothing nested here — this is the destination door.</p>}

      <p style={{ marginTop: 16 }}>
        <Link href={`/locations/${location.id}`}>Open full profile →</Link>
      </p>
    </main>
  );
}
