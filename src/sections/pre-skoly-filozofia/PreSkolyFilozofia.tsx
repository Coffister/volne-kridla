import { Box, Container, Text, Section, Squircle, Image } from "@/ui/primitives";

import { preSkolyPhotos } from "@/pages/PreSkoly/photos";

import styles from "./PreSkolyFilozofia.module.css";
import { PRE_SKOLY_CONTAINER } from "@/pages/PreSkoly/layout";

export default function PreSkolyFilozofia() {
  const photo = preSkolyPhotos.materskaSkola;

  return (
    <Section id="filozofia" className={styles.section}>
      <Container style={PRE_SKOLY_CONTAINER}>
        <Squircle radius="2xl" className={styles.card} reveal="up">
          <Squircle radius="lg" className={styles.mediaPanel}>
            <Image src={photo.src} alt={photo.alt} className={styles.mediaImage}
              data-reveal="media" />
          </Squircle>

          <Box className={styles.infoPanel} reveal="stagger">
            <Text as="h2" variant="sectionTitle" className={styles.infoTitle}>
              Naša filozofia
            </Text>
            <Text as="p" variant="body" className={styles.infoText}>
              Voľné krídla nie sú iba o voľnom lietaní. Sú o rešpekte, dôvere a
              porozumení.
            </Text>
            <Text as="p" variant="body" className={styles.infoText}>
              Chceme ľuďom ukázať, že papagáj môže byť oveľa viac než krásny vták
              v klietke. Je to osobnosť, ktorá potrebuje priestor, podnety, vzťah
              a možnosť správať sa prirodzene.
            </Text>
            <Text as="p" variant="cardTitle" className={styles.quote}>
              Aby mohol byť jednoducho papagájom. 🦜
            </Text>
          </Box>
        </Squircle>
      </Container>
    </Section>
  );
}
