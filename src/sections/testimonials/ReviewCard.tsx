import type { CSSProperties } from "react";
import { useState } from "react";
import {
  Box,
  Stack,
  Text,
  Image,
  Squircle,
} from "@/ui/primitives";

import type { Testimonial } from "./testimonial-map";

import styles from "./testimonials.module.css";

interface ReviewCardProps {
  testimonial: Testimonial;
}

export default function ReviewCard({ testimonial }: ReviewCardProps) {
  const [rotate] = useState(() => `${(Math.random() * 4 - 2).toFixed(2)}deg`);

  return (
    <Box
      className={styles.cardWrap}
      style={{ "--card-rotate": rotate } as CSSProperties}
    >
      <Squircle radius="2xl">
        <Stack className={styles.reviewCard} direction="row" align="stretch">
          <Squircle className={styles.contentPanel} radius="xl" borderColor="var(--border-color-primary)" borderWidth={3}>
            <Stack direction="column" gap="md" className={styles.inner}>
              <Text as="p" className={styles.innerBody} variant="body">
                {testimonial.text}
              </Text>{" "}
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
              draggable={false}
            />
          </Squircle>
        </Stack>
      </Squircle>
    </Box>
  );
}
