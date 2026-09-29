// Landmark taxonomy (maps PRD §12) + free-text support.
export const LANDMARK_TAXONOMY = [
  "mtn mast",
  "filling station",
  "church",
  "school",
  "pharmacy",
  "large tree",
  "billboard",
  "hotel",
  "bridge",
  "market",
  "security post",
  "hospital",
  "mosque",
  "bank",
  "bus stop",
] as const;

export function normalizeLandmarks(input: string[]): string[] {
  const seen = new Set<string>();
  for (const raw of input) {
    const v = raw.trim().toLowerCase().slice(0, 60);
    if (v) seen.add(v);
    if (seen.size >= 20) break;
  }
  return Array.from(seen);
}
