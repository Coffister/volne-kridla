import { useEffect, useMemo, useState, type CSSProperties } from "react";

import styles from "./Confetti.module.css";

// brand palette — orange/blue accents plus the sky-blue and gold surface tones
const COLORS = [
  "var(--color-accent-primary)",
  "var(--color-accent-secondary)",
  "var(--color-background-primary)",
  "var(--color-surface-secondary)",
];

const PIECE_COUNT = 44;
const LIFETIME_MS = 3600;

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
  width: number;
  height: number;
  drift: number;
}

// one-shot celebratory burst for the success step — plain CSS keyframes
// (falling + rotating + fading pieces), no animation library
export default function Confetti() {
  const [active, setActive] = useState(true);

  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        duration: 2.4 + Math.random() * 1.3,
        rotation: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        width: 6 + Math.random() * 6,
        height: 10 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 140,
      })),
    [],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setActive(false), LIFETIME_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <div className={styles.confetti} aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className={styles.piece}
          style={
            {
              left: `${p.left}%`,
              width: p.width,
              height: p.height,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--rotate-from": `${p.rotation}deg`,
              "--drift": `${p.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
