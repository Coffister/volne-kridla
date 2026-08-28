import { Box, Container, Stack, Text, Section, Squircle, Image } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";

import trainingPhoto from "@/assets/carousel/franka.webp";
import iconTrust from "@/assets/aboutvk/shield.webp";
import iconHealth from "@/assets/aboutvk/steps.webp";
import iconMental from "@/assets/aboutvk/clock.webp";

import { trainingRules } from "./rules";

import styles from "./VolneKridlaTraining.module.css";

const benefits = [
  {
    title: "Posilnenie dôvery",
    text: "Voľné lietanie umožňuje papagájovi spoznávať svet okolo seba, zatiaľ čo sa ti učí dôverovať.",
    icon: iconTrust,
  },
  {
    title: "Podpora fyzického zdravia",
    text: "Lietanie je prirodzený spôsob pohybu, ktorý udržuje svaly, kosti a kardiovaskulárny systém papagája v optimálnej kondícii.",
    icon: iconHealth,
  },
  {
    title: "Mentálna stimulácia a zábava",
    text: "Voľné lietanie poskytuje papagájovi nové podnety a zážitky, čím znižuje stres a zabraňuje nudeniu alebo nežiaducemu správaniu.",
    icon: iconMental,
  },
];

export default function VolneKridlaTraining() {
  return (
    <Section id="o-lietani" className={styles.section}>
      <Container>
        <Stack direction="column" align="center" gap="xs" className={styles.heading}>
          <Badge>Prečo by som mal učit papagája lietať?</Badge>
        </Stack>

        <Squircle radius="2xl" className={styles.card}>
          <Squircle radius="lg" className={styles.mediaPanel}>
            <Image src={trainingPhoto} alt="Papagáj počas letu" className={styles.mediaImage} />
          </Squircle>

          <Box className={styles.infoPanel}>
            <Text as="h2" variant="sectionTitle" className={styles.infoTitle}>
              Tréning voľného letu
            </Text>
            <Text as="p" variant="body" className={styles.infoText}>
              Hoci sú papagáje na let stvorené, nevedia ho prirodzene len tak robiť a robiť ho dobre v
              každom veku. Musia sa to naučiť a správne zvládnuť zručnosti. Letanie vonku je oveľa
              odlišné od lietania v interiéri (vietor, rozptyľovanie, dravce, preťaženie podnetmi
              atď.). A preto je veľmi dôležitý správne vedený tréning.
            </Text>
          </Box>
        </Squircle>

        <Squircle
          radius="xl"
          className={styles.rulesList}
          borderWidth={0}
          borderColor="white"
        >
          <Text as="h3" variant="sectionTitle" className={styles.rulesTitle}>
            Základne pravidlá ako postupovať pri tréningu na voľné lietanie:
          </Text>

          <Stack direction="column" gap="sm">
            {trainingRules.map((rule) => (
              <Text as="p" variant="body" key={rule} className={styles.ruleItem}>
                {rule}
              </Text>
            ))}
          </Stack>
        </Squircle>

        <Stack direction="column" align="center" gap="xs" className={styles.benefitsHeading}>
          <Badge>Výhody voľného lietania</Badge>
        </Stack>

        <Box className={styles.benefitsRow}>
          {benefits.map((benefit) => (
            <Squircle
              key={benefit.title}
              radius="md"
              className={styles.benefitCard}
              borderWidth={4}
              borderColor="var(--color-border-primary)"
            >
              <Image src={benefit.icon} alt="" className={styles.benefitIcon} />
              <Box>
                <Text as="h4" variant="body" weight="medium" className={styles.benefitTitle}>
                  {benefit.title}
                </Text>
                <Text as="p" variant="caption" className={styles.benefitText}>
                  {benefit.text}
                </Text>
              </Box>
            </Squircle>
          ))}
        </Box>
      </Container>
    </Section>
  );
}
