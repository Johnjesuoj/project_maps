import Link from "next/link";
import { auth } from "@/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", background: "#F8FAF6", color: "#14231A" }}>
        <header
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #DCE5DD",
            background: "#fff",
          }}
        >
          <Link href="/" style={{ fontWeight: 750 }}>Project Maps</Link>
          <span style={{ flex: 1 }} />
          {session?.user ? (
            <>
              <span style={{ fontSize: 13, color: "#5A6B60" }}>
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
