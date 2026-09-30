import { NextResponse } from "next/server";
import { auth } from "./auth";
import type { AppRole } from "./auth";

// Role enforcement (PRD.md Phase 1): CUSTOMER / QUBATORS_ADMIN / CONSULTANT.
export default auth((req) => {
  const role = req.auth?.user?.role as AppRole | undefined;
  const path = req.nextUrl.pathname;
  const isApi = path.startsWith("/api/");

  const deny = () => {
    if (isApi) return NextResponse.json({ error: "Forbidden" }, { status: role ? 403 : 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  };

  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    if (role !== "QUBATORS_ADMIN") return deny();
  }
  if (path.startsWith("/consultant")) {
    if (role !== "CONSULTANT" && role !== "QUBATORS_ADMIN") return deny();
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/consultant/:path*", "/api/admin/:path*"],
};
