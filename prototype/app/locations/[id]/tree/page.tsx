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
        <div key={c.id} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 12, marginBottom: 8 }}>
          <p style={{ margin: 0 }}>
            <Link href={`/locations/${c.id}/tree`}>{c.name}</Link>{" "}
            <span style={{ color: "var(--ink-muted)", fontSize: 13 }}>· {c.level}</span>
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 14 }}>{c.finalDirections}</p>
        </div>
      ))}
      {children.length === 0 && <p style={{ color: "var(--ink-muted)" }}>Nothing nested here — this is the destination door.</p>}

      <p style={{ marginTop: 16 }}>
        <Link href={`/locations/${location.id}`}>Open full profile →</Link>
      </p>
    </main>
  );
}
