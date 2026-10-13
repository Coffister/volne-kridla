import type { CSSProperties } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Image,
  Squircle,
} from "@/ui/primitives";

import type { Testimonial } from "./testimonial-map";

import { typography } from "@/ui/foundation/typography";

import styles from "./testimonials.module.css";

interface ReviewCardProps {
  testimonial: Testimonial;
  expanded: boolean;
  onToggle: () => void;
}

export default function ReviewCard({ testimonial, expanded, onToggle }: ReviewCardProps) {
  const [rotate] = useState(() => `${(Math.random() * 4 - 2).toFixed(2)}deg`);
  const cardRef = useRef<HTMLDivElement>(null);
  const [truncated, setTruncated] = useState(false);
  // expanding swaps the photo for the full text inside the SAME box — the card
  // keeps its size, so the carousel (and every card stretched to the row
  // height) doesn't jump around. Long text scrolls inside the card instead.
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (expanded) return;
    const body = cardRef.current?.querySelector<HTMLElement>(`.${styles.innerBody}`);
    if (!body) return;
    const measure = () => setTruncated(body.scrollHeight > body.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    return () => ro.disconnect();
  }, [expanded, testimonial.text]);

  function toggle() {
    setLockedHeight(expanded ? null : (cardRef.current?.offsetHeight ?? null));
    onToggle();
  }

  return (
    <Box
      className={styles.cardWrap}
      style={{ "--card-rotate": rotate } as CSSProperties}
    >
      <Squircle radius="2xl">
        <Stack
          ref={cardRef}
          className={`${styles.reviewCard} ${expanded ? styles.isExpanded : ""}`}
          style={expanded && lockedHeight ? { height: lockedHeight } : undefined}
          direction="row"
          align="stretch"
        >
          <Squircle className={styles.contentPanel} radius="xl" borderColor="var(--border-color-primary)" borderWidth={3}>
            <Stack direction="column" gap="md" className={styles.inner}>
              <div>
                <Text as="p" className={styles.innerBody} variant="body">
                  {testimonial.text}
                </Text>
                {(truncated || expanded) && (
                  <button
                    type="button"
                    className={styles.moreButton}
                    style={{ fontFamily: typography.body.fontFamily }}
                    aria-expanded={expanded}
                    onClick={toggle}
                  >
                    {expanded ? "Zobraziť menej" : "Zobraziť viac"}
                  </button>
                )}
              </div>
              <Text as="h2" variant="sectionSubtitle">
                {testimonial.clientName}
              </Text>
            </Stack>
          </Squircle>
          <Squircle radius="md" className={styles.mediaPanel}>
            <Image
              src={testimonial.image}
              alt={testimonial.clientName}
              className={styles.mediaImage}
              style={
                testimonial.imagePosition
                  ? { objectPosition: testimonial.imagePosition }
                  : undefined
              }
              draggable={false}
            />
          </Squircle>
        </Stack>
      </Squircle>
    </Box>
  );
}
