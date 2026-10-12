import Link from "next/link";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BottomNav } from "@/components/BottomNav";
import { SwRegister } from "@/components/SwRegister";
import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Project Maps",
  description: "From the road to the door.",
  themeColor: "#060E16",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/pwa-192x192.png",
    apple: "/pwa-192x192.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" data-theme="dark">
      <body style={{ margin: 0, fontFamily: "Montserrat, system-ui, sans-serif", background: "var(--bg-canvas)", color: "var(--ink)" }}>
        <header
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <Link href="/" style={{ fontWeight: 800, color: "var(--ink-strong)" }}>Project Maps</Link>
          <span className="mono-label">Nocturne · Live</span>
          <span style={{ flex: 1 }} />
          <ThemeToggle />
          {session?.user ? (
            <>
              <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                {session.user.name} · {session.user.role}
              </span>
              <Link href="/api/auth/signout">Sign out</Link>
            </>
          ) : (
            <Link href="/signin">Sign in</Link>
          )}
        </header>
        {children}
        <BottomNav />
        <SwRegister />
      </body>
    </html>
  );
}
