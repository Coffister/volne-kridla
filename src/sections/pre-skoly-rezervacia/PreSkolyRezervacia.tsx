import type { Icon } from "@phosphor-icons/react";
import { Buildings, MapPin, Users, CalendarCheck } from "@phosphor-icons/react";

import { Box, Container, Stack, Text, Section, Squircle } from "@/ui/primitives";
import Button from "@/ui/components/Button";
import { useRezervaciaModal } from "@/features/rezervacia-modal";
import { markOpenSource } from "@/lib/analytics";

import styles from "./PreSkolyRezervacia.module.css";
import { PRE_SKOLY_CONTAINER } from "@/pages/PreSkoly/layout";

const checklist: { icon: Icon; label: string }[] = [
  { icon: Buildings, label: "Názov vašej organizácie" },
  { icon: MapPin, label: "Mesto" },
  { icon: Users, label: "Približný počet a vek účastníkov" },
  { icon: CalendarCheck, label: "Preferovaný termín" },
];

export default function PreSkolyRezervacia() {
  const { open: openRezervacia } = useRezervaciaModal();

  return (
    <Section id="rezervacia" className={styles.section}>
      <Container style={PRE_SKOLY_CONTAINER}>
        <Squircle radius="2xl" className={styles.card} reveal="up">
          <Box className={styles.content} reveal="stagger">
            <Text as="span" variant="caption" className={styles.eyebrow}>
              Rezervácia prezentácie
            </Text>
            <Text as="h2" variant="sectionTitle" className={styles.title}>
              Chcete zažiť svet papagájov zblízka?
            </Text>
            <Text as="p" variant="body" className={styles.text}>
              Pozvite Voľné krídla k vám a rezervujte si termín prezentácie.
              Ozveme sa vám s návrhom programu a dohodneme všetky podrobnosti.
              Doprajte svojej skupine zážitok, ktorý zmení pohľad na papagáje.
            </Text>
          </Box>

          <Squircle radius={32} className={styles.panel} reveal="up">
            <Text as="h3" variant="cardTitle" className={styles.panelTitle}>
              Čo budeme potrebovať
            </Text>

            <Stack direction="column" gap="xs" className={styles.checklist} reveal="stagger">
              {checklist.map(({ icon: ItemIcon, label }) => (
                <Squircle key={label} radius={16} className={styles.checkItem}>
                  <span className={styles.checkIcon} aria-hidden>
                    <ItemIcon size={22} weight="bold" />
                  </span>
                  <Text as="span" variant="body" className={styles.checkLabel}>
                    {label}
                  </Text>
                </Squircle>
              ))}
            </Stack>

            <Button variant="primary" fullWidth className={styles.cta} onClick={() => {
                markOpenSource("pre-skoly-sekcia");
                openRezervacia();
              }}>
              Rezervovať prezentáciu
            </Button>
          </Squircle>
        </Squircle>

        <Text as="p" variant="sectionSubtitle" className={styles.closing} reveal="up">
          Možno po našom stretnutí už nikdy neuvidíte papagája len ako farebného
          vtáka v klietke. Uvidíte v ňom inteligentného, citlivého a fascinujúceho
          spoločníka. 🦜
        </Text>
      </Container>
    </Section>
  );
}
