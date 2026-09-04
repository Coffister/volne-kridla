import { Container, Stack, Text, Section } from "@/ui/primitives";
import Squircle from "@/ui/primitives/Squircle";
import Button from "@/ui/components/Button";

import { useKonzultaciaModal } from "@/features/konzultacia-modal";

import styles from "./CTA.module.css";

// Closing CTA shown at the bottom of every page, right above the footer.
// Copy leans directly on volnekridla.sk's own closing section ("Vidíš ich?
// Tí už spravili prvý krok." / "Ty môžeš byť ďalší...") and its consultation
// intro ("Nejde o to, že vám nadiktujem, čo máte robiť...").
export default function CTA() {
  const { open } = useKonzultaciaModal();

  return (
    <Section className={styles.section}>
      <Container>
        <Squircle
          radius="3xl"
          borderWidth={4}
          borderColor="var(--color-border-primary)"
          className={styles.cardWrapper}
        >
          <Stack
            direction="column"
            align="center"
            gap="sm"
            className={styles.card}
          >
            <Text as="h2" variant="sectionTitle" className={styles.heading}>
              Vidíš ich? Tí už spravili prvý krok.
            </Text>
            <Text as="p" variant="sectionSubtitle" className={styles.subheading}>
              Ty môžeš byť ďalší, kto dá svojmu papagájovi slobodu.
            </Text>
            <Text as="p" variant="body" className={styles.reassure}>
              Nejde o to, že vám počas pár minút nadiktujem, čo máte robiť —
              spolu si vysvetlíme, prečo veci fungujú tak, ako fungujú, a
              pôjdeme krok po kroku, kým to naozaj nesadne.
            </Text>
            <Button
              variant="primary"
              size="lg"
              className={styles.cta}
              onClick={() => open()}
            >
              Objednávka konzultácie
            </Button>
          </Stack>
        </Squircle>
      </Container>
    </Section>
  );
}
