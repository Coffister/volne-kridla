import { Container, Stack, Section, Squircle, Text } from "@/ui/primitives";
import Carousel from "@/ui/components/Carousel";

import { oMneCarouselImages } from "./carousel";

import styles from "./OMneIntro.module.css";

export default function OMneIntro() {
  return (
    <Section id="o-mne" className={styles.section}>
      <Container>
        <Stack direction="column" gap="md" className={styles.stack}>
          {/* this page has no visible heading — a real h1 text node is still
              needed for SEO/accessibility as the page's main heading */}
          <Text as="h1" className="srOnly">
            O mne — Franka
          </Text>
          <Squircle radius="2xl" className={styles.carouselWrapper}>
            <Carousel
              images={oMneCarouselImages}
              radius="xl"
              className={styles.carousel}
              borderWidth={2}
              borderColor="var(--color-surface-primary)"
            />
          </Squircle>
        </Stack>
      </Container>
    </Section>
  );
}
