import { Box, Container, Stack, Text, Image, Squircle } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import Badge from "@/ui/components/Badge";

import vkTypelogo from "@/assets/hero/volne-kridla.svg";
import { preSkolyPhotos } from "@/pages/PreSkoly/photos";
import { scrollToSection } from "@/lib/scrollToSection";
import { useRezervaciaModal } from "@/features/rezervacia-modal";

import styles from "./PreSkolyHero.module.css";

export default function PreSkolyHero() {
  const { open: openRezervacia } = useRezervaciaModal();

  return (
    <Box as="section" id="hero" className={styles.hero}>
      <Container>
        <Stack direction="column" align="center" gap="xs" className={styles.heading}>
          <Image src={vkTypelogo} alt="Voľné krídla" className={styles.title} />
          <Badge>Pre školy a organizácie</Badge>
        </Stack>

        <Squircle radius="2xl" className={styles.cardWrapper}>
          <Box className={styles.card}>
            <Stack direction="column" gap="sm" className={styles.content}>
              <Text as="span" variant="caption" className={styles.eyebrow}>
                Zážitkové prezentácie o papagájoch
              </Text>

              <Text as="h1" variant="sectionTitle" className={styles.headline}>
                Objavte svet papagájov tak, ako ho ešte nepoznáte.
              </Text>

              <Text as="p" variant="body" className={styles.lead}>
                Papagáj nie je ozdoba ani „vták do klietky“. Je inteligentný,
                zvedavý, spoločenský a plný osobnosti. Keď mu začneme rozumieť,
                otvorí sa nám úplne nový svet.
              </Text>

              <Stack direction="row" align="center" gap="lg" className={styles.actions}>
                <Button
                  variant="primary"
                  className={styles.primaryCta}
                  onClick={() => openRezervacia()}
                >
                  Rezervovať prezentáciu
                </Button>
                <Button variant="secondary" onClick={() => scrollToSection("program")}>
                  Čo vás čaká
                </Button>
              </Stack>
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
          </Box>
        </Squircle>
      </Container>
    </Box>
  );
}
