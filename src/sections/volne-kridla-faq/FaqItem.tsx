import { useEffect, useRef } from "react";

import { Box, Text, Squircle } from "@/ui/primitives";
import PlusIcon from "@/ui/icons/PlusIcon";

import styles from "./FaqItem.module.css";

interface FaqItemProps {
  question: string;
  answer: string;

  isOpen: boolean;
  onToggle: () => void;
}

export default function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(isOpen);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const cameFromOpen = wasOpen.current;
    wasOpen.current = isOpen;

    // Idle in the closed state (initial render, or re-runs that don't change
    // anything) — no animation, just make sure it's collapsed.
    if (!isOpen && !cameFromOpen) {
      wrap.style.height = "0px";
      return;
    }

    if (isOpen) {
      // 0 -> measured height, then release to `auto` so long content can still
      // reflow on viewport resize once the squish finishes.
      wrap.style.height = `${inner.offsetHeight}px`;

      const onEnd = (event: TransitionEvent) => {
        if (event.target === wrap && event.propertyName === "height") {
          wrap.style.height = "auto";
        }
      };

      wrap.addEventListener("transitionend", onEnd, { once: true });
      return () => wrap.removeEventListener("transitionend", onEnd);
    }

    // Closing: auto/px -> concrete px -> 0 so the transition has two real
    // values to animate between.
    wrap.style.height = `${inner.offsetHeight}px`;
    void wrap.offsetHeight; // force reflow

    const frame = requestAnimationFrame(() => {
      if (wrapRef.current) wrapRef.current.style.height = "0px";
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  return (
    <Squircle radius="md" className={styles.item} borderWidth={4} borderColor="#333">
      <div className={styles.header} onClick={onToggle}>
        <Text as="h3" variant="sectionSubtitle">
          {question}
        </Text>

        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}>
          <PlusIcon />
        </span>
      </div>

      <div
        ref={wrapRef}
        className={`${styles.answerWrap} ${isOpen ? styles.answerWrapOpen : ""}`}
        aria-hidden={!isOpen}
      >
        <div ref={innerRef} className={styles.answerInner}>
          <Box className={styles.answer}>
            <Text variant="body" className={styles.answerText}>
              {answer}
            </Text>
          </Box>
        </div>
      </div>
    </Squircle>
  );
}
