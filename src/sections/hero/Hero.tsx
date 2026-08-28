import { Box, Container, Stack, Text, Image } from "@/ui/primitives";
import Squircle from "@/ui/primitives/Squircle";
import Button from "@/ui/components/Button";
import Badge from "@/ui/components/Badge";
import Carousel from "@/ui/components/Carousel";

import vkTypelogo from "@/assets/hero/volne-kridla.svg";
import { heroCarouselImages } from "./carousel";

import styles from "./Hero.module.css";

const tags = [
  "Konzultácia výživy",
  "Voľné lietanie",
  "Target tréning",
  "Individuálny prístup",
  "Tipy a triky",
  "Rozsiahla komunita",
  "Konzultácie výchovy",
];

function TagRow({ reverse = false }: { reverse?: boolean }) {
  const items = reverse ? [...tags].reverse() : tags;

  return (
    <Squircle radius="2xl" className={`${styles.tagsRow} ${reverse ? styles.tagsRowReverse : ""}`}>
      <div className={styles.tagsTrack}>
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

export default function Hero() {
  return (
    <Box as="section" className={styles.hero}>
      <Container>
        <Stack direction="column" align="center" gap="xs" className={styles.heading}>
          <Image src={vkTypelogo} alt="Voľné krídla" className={styles.title} />
          <Badge>Nielen škola pre papagáje</Badge>
        </Stack>

        <Squircle
          radius="2xl"
          className={styles.cardWrapper}
        >
          <Box className={styles.card}>
            <Stack direction="column" gap="sm" className={styles.content}>
              <Text as="span" variant="caption" className={styles.eyebrow}>
                Tréning voľných krídel
              </Text>

              <Text as="h1" variant="sectionTitle" className={styles.headline}>
                Dopraj svojmu operencovi voľnosť letu, ktorú si zaslúži.
              </Text>

              <Text as="p" variant="body" className={styles.quote}>
                „Sloboda nie je len možnosť lietať, ale aj vedieť, kam sa vrátiť.“
              </Text>

              <Stack direction="row" align="center" gap="lg" className={styles.actions}>
                <Button variant="primary" className={styles.primaryCta}>
                  Začať lietať
                </Button>
                <Button variant="secondary">
                  Zistiť viac
                </Button>
              </Stack>
            </Stack>

            <Box className={styles.imageSlot}>
              <Carousel images={heroCarouselImages} radius="lg" />
            </Box>
          </Box>
        </Squircle>

        <div className={styles.tags}>
          <TagRow />
          <TagRow reverse />
        </div>
      </Container>
    </Box>
  );
}
