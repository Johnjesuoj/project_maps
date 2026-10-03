import Link from "next/link";
import { auth } from "@/auth";
import "./globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", background: "#060E16", color: "#DCE3EB" }}>
        <header
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #2F3A41",
            background: "#0D141A",
          }}
        >
          <Link href="/" style={{ fontWeight: 750, color: "#FFFFFF" }}>Project Maps</Link>
          <span className="mono-label">Nocturne · Live</span>
          <span style={{ flex: 1 }} />
          {session?.user ? (
            <>
              <span style={{ fontSize: 13, color: "#8A969C" }}>
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
