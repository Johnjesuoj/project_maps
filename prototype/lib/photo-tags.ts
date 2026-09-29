// Client-safe photo tag constants (no node imports — safe for client components).

export type PhotoTag = "turn_here" | "entrance" | "building" | "parking";

export const PHOTO_TAGS: PhotoTag[] = ["turn_here", "entrance", "building", "parking"];

export function photoTagLabel(tag: PhotoTag): string {
  switch (tag) {
    case "turn_here":
      return "Turn here";
    case "entrance":
      return "This is the entrance";
    case "building":
      return "Look for this building";
    case "parking":
      return "Park here";
  }
}
