import Link from "next/link";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

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
      </body>
    </html>
  );
}
