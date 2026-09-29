// Client-safe alert constants (no node imports — safe for client components).

export const ALERT_TYPES = [
  "construction",
  "checkpoint",
  "congestion",
  "closure",
  "accident",
  "flood",
  "event",
  "diversion",
] as const;

export type AlertType = (typeof ALERT_TYPES)[number];
export type AlertStatus = "active" | "cleared" | "expired";
