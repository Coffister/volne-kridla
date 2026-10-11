import { useState } from "react";

import { Box, Container, Stack, Text, Section, Squircle } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Lightbox from "@/ui/components/Lightbox";

import { preSkolyPhotos } from "@/pages/PreSkoly/photos";

import styles from "./PreSkolyPreKoho.module.css";

// audience chips, shown as a static wrap of tags
const audiences = [
  "Materské školy",
  "Základné školy",
  "Stredné školy",
  "Školské kluby",
  "Centrá voľného času",
  "Domovy seniorov",
  "Tábory",
  "Komunitné centrá",
  "Záujmové skupiny",
  "Chovateľské podujatia",
];

// one young, one adult audience — shows the range at a glance
const photos = [preSkolyPhotos.triedaSkupina, preSkolyPhotos.prednaska];

export default function PreSkolyPreKoho() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Section id="pre-koho" className={styles.section}>
      <Container>
        <Stack direction="column" align="center" className={styles.header}>
          <Badge>Pre koho?</Badge>
        </Stack>

        <Squircle radius="2xl" className={styles.card}>
          <Box className={styles.textRow}>
            <Box>
              <Text as="h2" variant="cardTitle" className={styles.title}>
                Pre koho sú prezentácie určené?
              </Text>
              <Text as="p" variant="body" className={styles.text}>
                Program prispôsobíme veku účastníkov, počtu ľudí aj vašim
                časovým možnostiam.
              </Text>
            </Box>

            <ul className={styles.audiences}>
              {audiences.map((audience, index) => (
                <li
                  key={audience}
                  className={`${styles.tag} ${index % 2 === 0 ? styles.tagBlue : styles.tagTan}`}
                >
                  {audience}
                </li>
              ))}
            </ul>
          </Box>

          <div className={styles.photos}>
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                className={styles.photo}
                onClick={() => setActiveIndex(index)}
                aria-label={`Zväčšiť obrázok: ${photo.alt}`}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </Squircle>

        <Lightbox
          items={photos}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onIndexChange={setActiveIndex}
        />
      </Container>
    </Section>
  );
}
