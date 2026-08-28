import { useState } from "react";

import { Container, Section, Stack, Text } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Lightbox from "@/ui/components/Lightbox";

import { galleryImages } from "@/pages/Fotogaleria/images";

import styles from "./Fotogaleria.module.css";

export default function Fotogaleria() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Section id="fotogaleria" className={styles.section}>
      <Container>
        <Stack direction="column" align="center" gap="sm" className={styles.heading}>
          <Text as="h1" variant="sectionTitle" className={styles.title}>
            Fotogaléria
          </Text>
          <Badge>Spoločné zážitky</Badge>
        </Stack>

        <div className={styles.grid}>
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={styles.item}
              onClick={() => setActiveIndex(index)}
              aria-label={`Zväčšiť obrázok: ${image.alt}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className={styles.image}
              />
            </button>
          ))}
        </div>
      </Container>

      <Lightbox
        items={galleryImages}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </Section>
  );
}
