"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("password");
  const next = searchParams?.next ?? "/";

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "48px 20px" }}>
      <h1>Sign in</h1>
      <p style={{ color: "var(--ink-muted)" }}>Local prototype — admin login: user / password.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          style={{ padding: 10, flex: 1 }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          style={{ padding: 10, flex: 1 }}
        />
        <button
          type="button"
          onClick={() => signIn("dev-login", { username, password, callbackUrl: next })}
        >
          Sign in
        </button>
      </div>
      <button type="button" onClick={() => signIn("google", { callbackUrl: next })}>
        Continue with Google
      </button>
      <p style={{ color: "var(--ink-muted)", fontSize: 13 }}>
        Google works once AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET are set.
      </p>
    </main>
  );
}
