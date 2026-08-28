import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./Lightbox.module.css";

export interface LightboxItem {
  src: string;
  alt: string;
}

interface LightboxProps {
  items: LightboxItem[];
  /** index of the currently shown item, or null when the lightbox is closed */
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}

// keep in sync with the exit animation duration in Lightbox.module.css
const CLOSE_ANIMATION_MS = 200;

// full-screen image viewer with keyboard + click navigation, rendered in a
// portal so it escapes any transformed / clipped ancestor
export default function Lightbox({ items, index, onClose, onIndexChange }: LightboxProps) {
  const isOpen = index !== null;

  // while true, the overlay plays its exit animation before the parent unmounts it
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const requestClose = useCallback(() => {
    if (closeTimer.current) return;
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = undefined;
      setIsClosing(false);
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [onClose]);

  const goTo = useCallback(
    (next: number) => {
      const count = items.length;
      onIndexChange((next + count) % count);
    },
    [items.length, onIndexChange],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
      if (event.key === "ArrowRight") goTo((index as number) + 1);
      if (event.key === "ArrowLeft") goTo((index as number) - 1);
    };

    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, index, goTo, requestClose]);

  // clear a pending close timer if the component unmounts mid-animation
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  if (!isOpen) return null;

  const current = items[index as number];

  return createPortal(
    <div
      className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Zväčšený obrázok"
      onClick={requestClose}
    >
      <button
        type="button"
        className={`${styles.control} ${styles.close}`}
        aria-label="Zavrieť"
        onClick={requestClose}
      >
        ×
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.control} ${styles.prev}`}
            aria-label="Predchádzajúci obrázok"
            onClick={(event) => {
              event.stopPropagation();
              goTo((index as number) - 1);
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.control} ${styles.next}`}
            aria-label="Ďalší obrázok"
            onClick={(event) => {
              event.stopPropagation();
              goTo((index as number) + 1);
            }}
          >
            ›
          </button>
        </>
      )}

      <figure className={styles.figure} onClick={(event) => event.stopPropagation()}>
        <img className={styles.image} src={current.src} alt={current.alt} />
      </figure>

      {items.length > 1 && (
        <span className={styles.counter}>
          {(index as number) + 1} / {items.length}
        </span>
      )}
    </div>,
    document.body,
  );
}
