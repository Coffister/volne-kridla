import { Box, Container, Stack, Text, Image, Squircle } from "@/ui/primitives";
import Button from "@/ui/components/Button";

import vkTypelogo from "@/assets/hero/volne-kridla.svg";
import ribbon from "@/assets/logos/Vector.svg";
import { preSkolyPhotos } from "@/pages/PreSkoly/photos";
import { useRezervaciaModal } from "@/features/rezervacia-modal";
import { markOpenSource } from "@/lib/analytics";

import styles from "./PreSkolyHero.module.css";
import { PRE_SKOLY_CONTAINER } from "@/pages/PreSkoly/layout";

export default function PreSkolyHero() {
  const { open: openRezervacia } = useRezervaciaModal();

  return (
    <Box as="section" id="hero" className={styles.hero}>
      <Container style={PRE_SKOLY_CONTAINER}>
        <div className={styles.heading}>
          <Image src={vkTypelogo} alt="Voľné krídla" className={styles.title} data-reveal="up" />
          <Image
            src={ribbon}
            alt="Pre školy a organizácie"
            className={styles.ribbon}
            data-reveal="pop"
            width={549}
            height={114}
            loading="eager"
          />
        </div>

        <Squircle radius="2xl" className={styles.card} reveal="up">
          <Stack direction="column" className={styles.content} reveal="stagger">
            <Text as="h1" variant="sectionTitle" className={styles.headline}>
              Objavte svet papagájov tak, ako ho ešte nepoznáte!
            </Text>

            <Text as="p" variant="body" className={styles.lead}>
              Papagáj nie je ozdoba ani „vták do klietky“. Je inteligentný,
              zvedavý, spoločenský a plný osobnosti. Keď mu začneme rozumieť,
              otvorí sa nám úplne nový svet.
            </Text>

            <Button variant="primary" className={styles.cta} onClick={() => {
              markOpenSource("pre-skoly-hero");
              openRezervacia();
            }}>
              Rezervovať prezentáciu
            </Button>
          </Stack>

          <Squircle radius="lg" className={styles.imageSlot}>
            <Image
              src={preSkolyPhotos.frankaAra.src}
              alt={preSkolyPhotos.frankaAra.alt}
              className={styles.image}
              data-reveal="media"
              loading="eager"
              fetchPriority="high"
            />
          </Squircle>
        </Squircle>
      </Container>
    </Box>
  );
}
