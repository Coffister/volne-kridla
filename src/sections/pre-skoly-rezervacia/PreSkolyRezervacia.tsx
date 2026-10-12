import { Container, Stack, Text, Section } from "@/ui/primitives";
import type { Icon } from "@phosphor-icons/react";
import { Buildings, MapPin, Users, CalendarCheck } from "@phosphor-icons/react";

import Button from "@/ui/components/Button";
import { useRezervaciaModal } from "@/features/rezervacia-modal";
import { PRE_SKOLY_CONTAINER } from "@/pages/PreSkoly/layout";

import styles from "./PreSkolyRezervacia.module.css";

// what the booking form will ask for — shown up front so nobody is surprised
const needs: { icon: Icon; label: string }[] = [
  { icon: Buildings, label: "Názov organizácie" },
  { icon: MapPin, label: "Mesto" },
  { icon: Users, label: "Počet a vek účastníkov" },
  { icon: CalendarCheck, label: "Preferovaný termín" },
];

// Closing CTA straight on the sky background: outlined brand heading, one
// line of text, one button — the booking modal itself asks for the details.
export default function PreSkolyRezervacia() {
  const { open: openRezervacia } = useRezervaciaModal();

  return (
    <Section id="rezervacia" className={styles.section}>
      <Container style={PRE_SKOLY_CONTAINER}>
        <Stack direction="column" align="center" className={styles.content}>
          <Text as="h2" variant="sectionTitle" className={styles.title}>
            Chcete zažiť svet papagájov zblízka?
          </Text>
          <Text as="p" variant="body" className={styles.text}>
            Pozvite Voľné krídla k vám. Ozveme sa vám s návrhom programu a
            dohodneme všetky podrobnosti.
          </Text>
          <div className={styles.needs}>
            <Text as="span" variant="caption" className={styles.needsLabel}>
              Budeme potrebovať
            </Text>
            <ul className={styles.pills}>
              {needs.map(({ icon: NeedIcon, label }) => (
                <li key={label} className={styles.pill}>
                  <span className={styles.pillIcon} aria-hidden>
                    <NeedIcon size={16} weight="bold" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <Button variant="primary" className={styles.cta} onClick={() => openRezervacia()}>
            Rezervovať prezentáciu
          </Button>
        </Stack>

        <Text as="p" variant="body" className={styles.closing}>
          Možno po našom stretnutí už nikdy neuvidíte papagája len ako farebného
          vtáka v klietke. Uvidíte v ňom inteligentného, citlivého a fascinujúceho
          spoločníka. 🦜
        </Text>
      </Container>
    </Section>
  );
}
