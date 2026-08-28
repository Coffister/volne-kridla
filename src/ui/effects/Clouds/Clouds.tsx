import { useRef } from "react";

import { useParallax } from "@/hooks/useParallax";

import styles from "./Clouds.module.css";

// simple flat, bold-outlined cloud silhouette — matches the site's squircle/outline style
// instead of a photoreal cloud texture
function CloudShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 80" className={className} aria-hidden focusable="false">
      <path
        d="M20,70 Q5,70 5,55 Q5,40 20,38 Q22,15 45,15 Q60,0 80,10 Q100,0 115,15 Q140,15 140,38 Q155,40 155,55 Q155,70 140,70 Z"
        fill="var(--color-surface-primary)"
        stroke="var(--color-border-primary)"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloudTrack({ count, reverse }: { count: number; reverse?: boolean }) {
  const clouds = Array.from({ length: count * 2 });

  return (
    <div className={`${styles.track} ${reverse ? styles.trackReverse : ""}`}>
      {clouds.map((_, index) => (
        <CloudShape key={index} className={styles.cloud} />
      ))}
    </div>
  );
}

export default function Clouds() {
  // parallax is measured against the whole page, not the (fixed) layer itself,
  // otherwise its viewport position never changes and nothing would move
  const pageRef = useRef<HTMLElement | null>(
    typeof document !== "undefined" ? document.body : null,
  );

  const parallaxOptions = { trigger: pageRef, start: "top top", end: "bottom bottom" };

  const backRef = useParallax<HTMLDivElement>({ ...parallaxOptions, speed: -8 });
  const midRef = useParallax<HTMLDivElement>({ ...parallaxOptions, speed: -20 });
  const frontRef = useParallax<HTMLDivElement>({ ...parallaxOptions, speed: -38 });

  return (
    <div className={styles.sky} aria-hidden>
      <div ref={backRef} className={`${styles.layer} ${styles.layerBack}`}>
        <CloudTrack count={4} />
      </div>

      <div ref={midRef} className={`${styles.layer} ${styles.layerMid}`}>
        <CloudTrack count={3} reverse />
      </div>

      <div ref={frontRef} className={`${styles.layer} ${styles.layerFront}`}>
        <CloudTrack count={3} />
      </div>
    </div>
  );
}
