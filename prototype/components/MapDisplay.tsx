"use client";

import { useEffect, useRef } from "react";

export type MapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

// Nocturne map: Carto dark_matter tiles in dark mode, light_all in light mode.
// Markers are mint glow dots (divIcon — no image assets to break).
export function MapDisplay({ points, height = 300 }: { points: MapPoint[]; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: { remove: () => void } | null = null;
    let observer: MutationObserver | null = null;
    let cancelled = false;

    async function init() {
      const L = await import("leaflet");
      if (cancelled || !ref.current) return;
      const el = ref.current;
      map = L.map(el, { scrollWheelZoom: false });
      const tiles = L.tileLayer("", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      });
      tiles.addTo(map as never);

      function applyTheme() {
        const dark = document.documentElement.dataset.theme !== "light";
        tiles.setUrl("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
        const panes = el.querySelectorAll(".leaflet-tile-pane");
        panes.forEach((p) => p.classList.toggle("osm-dark", dark));
      }
      applyTheme();
      observer = new MutationObserver(applyTheme);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      const pts = points.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
      if (pts.length === 0) {
        (map as never as { setView: (c: [number, number], z: number) => void }).setView([6.5244, 3.3792], 11);
      } else {
        const bounds = L.latLngBounds(pts.map((p) => [p.lat, p.lng] as [number, number]));
        (map as never as { fitBounds: (b: unknown, o: object) => void }).fitBounds(bounds, { padding: [24, 24] });
        if (pts.length === 1) {
          (map as never as { setView: (c: [number, number], z: number) => void }).setView([pts[0].lat, pts[0].lng], 15);
        }
      }
      for (const p of pts) {
        const icon = L.divIcon({ className: "", html: '<div class="map-dot"></div>', iconSize: [14, 14] });
        L.marker([p.lat, p.lng], { icon })
          .addTo(map as never)
          .bindPopup(`<a href="/locations/${p.id}">${p.name}</a>`);
      }
    }
    init();
    return () => {
      cancelled = true;
      observer?.disconnect();
      map?.remove();
    };
  }, []);

  return <div ref={ref} style={{ height, width: "100%", zIndex: 0 }} />;
}
