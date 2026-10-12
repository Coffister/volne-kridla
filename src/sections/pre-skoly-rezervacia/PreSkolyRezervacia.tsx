import { Container, Text, Section, Squircle } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import { useRezervaciaModal } from "@/features/rezervacia-modal";
import { PRE_SKOLY_CONTAINER } from "@/pages/PreSkoly/layout";

import styles from "./PreSkolyRezervacia.module.css";

// Closing CTA: one centred card — the booking modal itself asks for the
// details, so this only needs to invite and open it.
export default function PreSkolyRezervacia() {
  const { open: openRezervacia } = useRezervaciaModal();

  return (
    <Section id="rezervacia" className={styles.section}>
      <Container style={PRE_SKOLY_CONTAINER}>
        <Squircle radius="2xl" className={styles.card}>
          <Text as="h2" variant="sectionTitle" className={styles.title}>
            Chcete zažiť svet papagájov zblízka?
          </Text>
          <Text as="p" variant="body" className={styles.text}>
            Pozvite Voľné krídla k vám. Ozveme sa vám s návrhom programu a
            dohodneme všetky podrobnosti.
          </Text>
          <Button variant="primary" className={styles.cta} onClick={() => openRezervacia()}>
            Rezervovať prezentáciu
          </Button>
        </Squircle>

        <Text as="p" variant="body" className={styles.closing}>
          Možno po našom stretnutí už nikdy neuvidíte papagája len ako farebného
          vtáka v klietke. Uvidíte v ňom inteligentného, citlivého a fascinujúceho
          spoločníka. 🦜
        </Text>
      </Container>
    </Section>
  );
}
