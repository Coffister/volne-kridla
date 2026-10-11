import { useState } from "react";

import { Box, Container, Stack, Text, Section, Squircle } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Lightbox from "@/ui/components/Lightbox";

import { preSkolyPhotos } from "@/pages/PreSkoly/photos";

import styles from "./PreSkolyPreKoho.module.css";

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

// same marquee as the home page Hero tags
function TagRow({ reverse = false }: { reverse?: boolean }) {
  const items = reverse ? [...audiences].reverse() : audiences;

  return (
    <Squircle radius="2xl" className={`${styles.tagsRow} ${reverse ? styles.tagsRowReverse : ""}`}>
      <div className={styles.tagsTrack} aria-hidden>
        {[...items, ...items].map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className={`${styles.tag} ${index % 2 === 0 ? styles.tagBlue : styles.tagTan}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </Squircle>
  );
}

export default function PreSkolyPreKoho() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Section id="pre-koho" className={styles.section}>
      <Container>
        <Stack direction="column" align="center" className={styles.header}>
          <Badge>Pre koho?</Badge>
        </Stack>

        <Squircle radius="2xl" className={styles.card}>
          {/* the marquee is decorative — screen readers get the plain list */}
          <ul className="srOnly">
            {audiences.map((audience) => (
              <li key={audience}>{audience}</li>
            ))}
          </ul>

          <div className={styles.tags}>
            <TagRow />
            <TagRow reverse />
          </div>

          <Box className={styles.textRow}>
            <Text as="h2" variant="cardTitle" className={styles.title}>
              Pre koho sú prezentácie určené?
            </Text>
            <Text as="p" variant="body" className={styles.text}>
              Pre materské, základné a stredné školy, školské kluby, centrá
              voľného času, domovy seniorov, tábory, komunitné centrá, záujmové
              skupiny a chovateľské podujatia. Program prispôsobíme veku
              účastníkov, počtu ľudí aj vašim časovým možnostiam.
            </Text>
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
