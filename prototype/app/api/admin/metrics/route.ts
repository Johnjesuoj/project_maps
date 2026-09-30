import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { arrivalStats } from "@/lib/arrival";
import { listClaims, listCorrections } from "@/lib/trust";
import { listAlerts } from "@/lib/alerts";
import { listReports } from "@/lib/reports";
import { listLocations, type LocationRecord } from "@/lib/locations";

// Aggregates for /admin/metrics: creations, verifications, corrections,
// alerts, reports, arrivals. (Share-link hits are not tracked yet —
// arrivals on shared locations are the success proxy.)
export async function GET() {
  const all = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "data", "locations.json"), "utf-8")
  ) as LocationRecord[];
  const [claims, corrections, alerts, reports, arrivals, publicList] = await Promise.all([
    listClaims(),
    listCorrections(),
    listAlerts({ includePast: true }),
    listReports(),
    arrivalStats(),
    listLocations(),
  ]);
  const byVerification: Record<string, number> = {};
  for (const l of all) {
    byVerification[l.verificationStatus] = (byVerification[l.verificationStatus] ?? 0) + 1;
  }
  return NextResponse.json({
    locations: { total: all.length, public: publicList.length, byVerification },
    claims: {
      total: claims.length,
      pending: claims.filter((c) => c.status === "pending").length,
      approved: claims.filter((c) => c.status === "approved").length,
    },
    corrections: {
      total: corrections.length,
      pending: corrections.filter((c) => c.status === "pending").length,
      confirmed: corrections.filter((c) => c.status === "confirmed").length,
    },
    alerts: {
      total: alerts.length,
      active: alerts.filter((a) => a.status === "active").length,
    },
    reports: {
      total: reports.length,
      pending: reports.filter((r) => r.status === "pending").length,
    },
    arrivals,
  });
}
