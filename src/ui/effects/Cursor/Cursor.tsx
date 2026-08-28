import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import defaultCursor from "@/assets/cursor/default.png";
import pointerCursor from "@/assets/cursor/pointer.png";
import dragCursor from "@/assets/cursor/drag-animated.svg";

import styles from "./Cursor.module.css";
import "./cursor.css";

type CursorState = "default" | "pointer" | "drag";

const SOURCES: Record<CursorState, string> = {
  default: defaultCursor,
  pointer: pointerCursor,
  drag: dragCursor,
};

const STATES: CursorState[] = ["default", "pointer", "drag"];

// on-screen size relative to the asset's native pixels (the PNGs are exported
// large for crispness) — bump up/down to taste
const SCALE = 0.48;

// pixel inside each image (in NATIVE asset coordinates) that should sit exactly
// on the real pointer — tweak per art if it feels off
const HOTSPOTS: Record<CursorState, { x: number; y: number }> = {
  default: { x: 3, y: 3 },
  pointer: { x: 20, y: 4 },
  drag: { x: 34, y: 20 },
};

// selectors that should read as "clickable"
const POINTER_SELECTOR =
  'a, button, input, textarea, select, label, summary, [role="button"], [role="link"], [data-cursor="pointer"]';

const DRAG_SELECTOR = '[data-cursor="drag"]';

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// PNG/SVG cursor that swaps the whole image between three states:
//   default — arrow
//   pointer — hand, over anything clickable
//   drag    — animated grab hand, over anything tagged `data-cursor="drag"`
// It trails the real pointer by a hair (GSAP quickTo). Fine-pointer only;
// touch keeps the native cursor.
export default function Cursor() {
  const followerRef = useRef<HTMLDivElement | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<CursorState>("default");

  useEffect(() => {
    if (!canHover()) return;
    setEnabled(true);

    // warm the cache so the first state change doesn't flicker
    Object.values(SOURCES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const follower = followerRef.current;
    if (!follower) return;

    document.documentElement.classList.add("has-custom-cursor");

    // "very, very subtle" trail — barely behind the real pointer
    const duration = prefersReducedMotion() ? 0 : 0.09;
    const xTo = gsap.quickTo(follower, "x", { duration, ease: "power1.out" });
    const yTo = gsap.quickTo(follower, "y", { duration, ease: "power1.out" });

    const resolveState = (target: EventTarget | null): CursorState => {
      if (!(target instanceof Element)) return "default";
      if (target.closest(DRAG_SELECTOR)) return "drag";
      if (target.closest(POINTER_SELECTOR)) return "pointer";
      return "default";
    };

    const handleMove = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      setVisible(true);
      setState(resolveState(event.target));
    };

    const handleOver = (event: PointerEvent) => {
      setState(resolveState(event.target));
    };

    const hide = () => setVisible(false);
    const show = () => setVisible(true);

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    document.documentElement.addEventListener("pointerenter", show);
    window.addEventListener("blur", hide);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.documentElement.removeEventListener("pointerenter", show);
      window.removeEventListener("blur", hide);
      gsap.killTweensOf(follower);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={followerRef}
      aria-hidden
      className={`${styles.follower} ${visible ? styles.visible : ""}`}
    >
      {/* all three are always mounted and stacked; only the active one is
          faded in, so switching states cross-fades instead of hard-cutting
          (and the animated drag SVG keeps playing underneath) */}
      {STATES.map((s) => {
        const hotspot = HOTSPOTS[s];
        return (
          <span
            key={s}
            data-active={s === state}
            className={styles.layer}
            style={{
              transform: `translate(${-hotspot.x * SCALE}px, ${-hotspot.y * SCALE}px) scale(${SCALE})`,
            }}
          >
            <img
              src={SOURCES[s]}
              alt=""
              draggable={false}
              className={styles.image}
              style={{ transformOrigin: `${hotspot.x}px ${hotspot.y}px` }}
            />
          </span>
        );
      })}
    </div>
  );
}
