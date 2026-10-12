import { useEffect, useState } from "react";

// keep in sync with the 560px / 900px breakpoints in Fotogaleria.module.css
const QUERIES: [string, number][] = [
  ["(max-width: 560px)", 1],
  ["(max-width: 900px)", 2],
];

function current(): number {
  if (typeof window === "undefined") return 3;
  for (const [q, n] of QUERIES) if (window.matchMedia(q).matches) return n;
  return 3;
}

/** 3 / 2 / 1 masonry columns, following the viewport. */
export function useColumnCount(): number {
  const [count, setCount] = useState(current);
  useEffect(() => {
    const lists = QUERIES.map(([q]) => window.matchMedia(q));
    const update = () => setCount(current());
    lists.forEach((l) => l.addEventListener("change", update));
    return () => lists.forEach((l) => l.removeEventListener("change", update));
  }, []);
  return count;
}
