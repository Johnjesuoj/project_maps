"use client";

import { useEffect } from "react";

// Registers the offline-shell service worker (production only).
export function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && window.location.hostname !== "localhost") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
