import { promises as fs } from "node:fs";
import path from "node:path";

// Abuse reports for photos / alerts / locations (mirrors Prisma AbuseReport).
// Review-based queue at /admin/reports — nothing is auto-deleted.

export type AbuseReportRecord = {
  id: string;
  targetType: "photo" | "alert" | "location";
  targetId: string;
  reason: string;
  status: "pending" | "dismissed" | "actioned";
  createdAt: string;
  updatedAt: string;
};

const REPORTS_FILE = path.join(process.cwd(), "data", "reports.json");

export async function listReports(status?: AbuseReportRecord["status"]): Promise<AbuseReportRecord[]> {
  const rows = JSON.parse(await fs.readFile(REPORTS_FILE, "utf-8")) as AbuseReportRecord[];
  const scoped = status ? rows.filter((r) => r.status === status) : rows;
  return scoped.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function createReport(input: {
  targetType: AbuseReportRecord["targetType"];
  targetId: string;
  reason: string;
}): Promise<AbuseReportRecord> {
  const rows = JSON.parse(await fs.readFile(REPORTS_FILE, "utf-8")) as AbuseReportRecord[];
  const now = new Date().toISOString();
  const row: AbuseReportRecord = {
    id: `rep_${Date.now().toString(36)}`,
    ...input,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  rows.push(row);
  await fs.writeFile(REPORTS_FILE, JSON.stringify(rows, null, 2) + "\n", "utf-8");
  return row;
}

export async function decideReport(
  id: string,
  action: "dismiss" | "action"
): Promise<AbuseReportRecord | null> {
  const rows = JSON.parse(await fs.readFile(REPORTS_FILE, "utf-8")) as AbuseReportRecord[];
  const report = rows.find((r) => r.id === id);
  if (!report || report.status !== "pending") return null;
  report.status = action === "dismiss" ? "dismissed" : "actioned";
  report.updatedAt = new Date().toISOString();
  await fs.writeFile(REPORTS_FILE, JSON.stringify(rows, null, 2) + "\n", "utf-8");
  return report;
}
