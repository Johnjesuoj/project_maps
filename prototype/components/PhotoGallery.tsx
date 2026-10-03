import { photoTagLabel } from "@/lib/photo-tags";
import type { PhotoRecord } from "@/lib/photos";

export function PhotoGallery({ photos }: { photos: PhotoRecord[] }) {
  if (photos.length === 0) return null;
  const groups = new Map<string, PhotoRecord[]>();
  for (const p of photos) {
    const list = groups.get(p.tag) ?? [];
    list.push(p);
    groups.set(p.tag, list);
  }
  return (
    <section>
      <h2>Visual references</h2>
      {Array.from(groups.entries()).map(([tag, items]) => (
        <div key={tag} style={{ marginBottom: 12 }}>
          <p style={{ fontWeight: 650, margin: "8px 0 4px" }}>{photoTagLabel(tag as PhotoRecord["tag"])}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {items.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.id} src={p.url} alt={photoTagLabel(p.tag)} width={220} style={{ borderRadius: 8, border: "1px solid var(--border)" }} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
