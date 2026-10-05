"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const TABS = [
  { href: "/admin/claims", icon: "shield_person", label: "Queue" },
  { href: "/admin/metrics", icon: "monitoring", label: "Metrics" },
  { href: "/admin/reports", icon: "flag", label: "Reports" },
];

export function AdminHeader({ title, eyebrow }: { title: string; eyebrow: string }) {
  const pathname = usePathname();
  return (
    <div style={{ marginBottom: 16 }}>
      <p>
        <Link href="/">← Map</Link>
      </p>
      <p className="mono-label" style={{ margin: "8px 0 0" }}>
        <Icon name="shield_person" size={14} /> {eyebrow}
      </p>
      <h1 style={{ fontSize: 24, margin: "4px 0 12px", fontWeight: 800 }}>{title}</h1>
      <div style={{ display: "flex", gap: 8 }}>
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={active ? "filter-pill active" : "filter-pill"}
              style={{
                textDecoration: "none",
                background: active ? undefined : "var(--surface-nested)",
                color: active ? undefined : "var(--ink-muted)",
                border: "1px solid var(--border)",
              }}
            >
              <Icon name={t.icon} size={14} /> {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
