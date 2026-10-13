import { Box, Container, Stack, Text, Image } from "@/ui/primitives";
import Squircle from "@/ui/primitives/Squircle";
import Button from "@/ui/components/Button";
import Badge from "@/ui/components/Badge";
import Carousel from "@/ui/components/Carousel";
import { useNavigate } from "react-router-dom";
import { useKonzultaciaModal } from "@/features/konzultacia-modal";
import { markOpenSource } from "@/lib/analytics";

import vkTypelogo from "@/assets/hero/volne-kridla.svg";
import { heroCarouselImages } from "./carousel";

import styles from "./Hero.module.css";

// home hero only (the Voľné krídla intro keeps the original order):
// photo 2 leads, photo 1 moves to fourth place
const [photo1, photo2, photo3, photo4, ...restPhotos] = heroCarouselImages;
const heroSlides = [photo2, photo3, photo4, photo1, ...restPhotos];

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
  const navigate = useNavigate();
  const { open: openKonzultacia } = useKonzultaciaModal();

  return (
    <Box as="section" className={styles.hero}>
      <Container>
        <Stack direction="column" align="center" gap="xs" className={styles.heading}>
          <Image src={vkTypelogo} alt="Voľné krídla" className={styles.title} data-reveal="up" />
          <Badge>Nielen škola pre papagáje</Badge>
        </Stack>

        <Squircle
          radius="2xl"
          className={styles.cardWrapper}
          reveal="up"
        >
          <Box className={styles.card}>
            <Stack direction="column" gap="sm" className={styles.content} reveal="stagger">
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
                <Button
                  variant="primary"
                  className={styles.primaryCta}
                  onClick={() => {
                    markOpenSource("hero");
                    openKonzultacia();
                  }}
                >
                  Začať lietať
                </Button>
                <Button variant="secondary" onClick={() => navigate("/volne-kridla")}>
                  Zistiť viac
                </Button>
              </Stack>
            </Stack>

            <Box className={styles.imageSlot}>
              <Carousel
                images={heroSlides}
                radius="lg"
                autoplayInterval={3000}
                swipeable={false}
              />
            </Box>
          </Box>
        </Squircle>

        <div className={styles.tags} data-reveal="up">
          <TagRow />
          <TagRow reverse />
        </div>
      </Container>
    </Box>
  );
}
