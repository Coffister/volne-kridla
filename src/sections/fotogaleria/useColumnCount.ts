import { useSyncExternalStore } from "react";

// keep in sync with the 560px / 900px breakpoints in Fotogaleria.module.css
const QUERIES: [string, number][] = [
  ["(max-width: 560px)", 1],
  ["(max-width: 900px)", 2],
];

function current(): number {
  for (const [q, n] of QUERIES) if (window.matchMedia(q).matches) return n;
  return 3;
}

function subscribe(onChange: () => void): () => void {
  const lists = QUERIES.map(([q]) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

// the prerendered HTML is laid out for 3 columns; when hydrating, React
// starts from this value and then switches to the viewport's real count
const serverSnapshot = () => 3;

/** 3 / 2 / 1 masonry columns, following the viewport. */
export function useColumnCount(): number {
  return useSyncExternalStore(subscribe, current, serverSnapshot);
}
