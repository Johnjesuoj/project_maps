import { listAlerts } from "@/lib/alerts";
import { AlertList } from "@/components/AlertList";
import { AlertComposer } from "@/components/AlertComposer";
import { Icon } from "@/components/Icon";

// Alerts tab home: every active road condition + road-level reporting.
export default async function AlertsPage() {
  const alerts = await listAlerts();
  return (
    <main className="phone-col">
      <p className="mono-label" style={{ margin: "0 0 4px" }}>
        <Icon name="warning" size={14} /> Live radar
      </p>
      <h1 style={{ fontSize: 24, margin: "0 0 4px", fontWeight: 800 }}>Road conditions</h1>
      <p style={{ color: "var(--ink-muted)", fontSize: 14, margin: "0 0 12px" }}>
        {alerts.length} active alert{alerts.length === 1 ? "" : "s"} · confirm what is still happening
      </p>
      <AlertList alerts={alerts} />
      <AlertComposer />
    </main>
  );
}
