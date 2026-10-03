"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function ShareButtons({ id, name }: { id: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/l/${id}`;
  const url =
    typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  const text = encodeURIComponent(`${name} — find it here: ${url}`);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
      <a href={`https://wa.me/?text=${text}`} target="_blank" rel="noreferrer">
        <Icon name="share" size={16} /> WhatsApp
      </a>
      <a href={`sms:?&body=${text}`}>
        <Icon name="sms" size={16} /> SMS
      </a>
      <button type="button" onClick={copy}>
        <Icon name="link" size={16} /> {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
