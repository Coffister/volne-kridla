import { Box, Container, Stack, Text, Image, Squircle } from "@/ui/primitives";
import Button from "@/ui/components/Button";

import vkTypelogo from "@/assets/hero/volne-kridla.svg";
import ribbon from "@/assets/pre-skoly/stuha-pre-skoly.svg";
import { preSkolyPhotos } from "@/pages/PreSkoly/photos";
import { useRezervaciaModal } from "@/features/rezervacia-modal";

import styles from "./PreSkolyHero.module.css";

export default function PreSkolyHero() {
  const { open: openRezervacia } = useRezervaciaModal();

  return (
    <Box as="section" id="hero" className={styles.hero}>
      <Container style={{ maxWidth: 1140 }}>
        <div className={styles.heading}>
          <Image src={vkTypelogo} alt="Voľné krídla" className={styles.title} />
          <Image
            src={ribbon}
            alt="Pre školy a organizácie"
            className={styles.ribbon}
            width={548}
            height={112}
            loading="eager"
          />
        </div>

        <Squircle radius="2xl" className={styles.card}>
          <Stack direction="column" className={styles.content}>
            <Text as="h1" variant="sectionTitle" className={styles.headline}>
              Objavte svet papagájov tak, ako ho ešte nepoznáte!
            </Text>

            <Text as="p" variant="body" className={styles.lead}>
              Papagáj nie je ozdoba ani „vták do klietky“. Je inteligentný,
              zvedavý, spoločenský a plný osobnosti. Keď mu začneme rozumieť,
              otvorí sa nám úplne nový svet.
            </Text>

            <Button variant="primary" className={styles.cta} onClick={() => openRezervacia()}>
              Rezervovať prezentáciu
            </Button>
          </Stack>

          <Squircle radius="lg" className={styles.imageSlot}>
            <Image
              src={preSkolyPhotos.frankaAra.src}
              alt={preSkolyPhotos.frankaAra.alt}
              className={styles.image}
              loading="eager"
              fetchPriority="high"
            />
          </Squircle>
        </Squircle>
      </Container>
    </Box>
  );
}
