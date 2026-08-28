import { Box, Container, Stack, Text, Section, Squircle, Image } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";

import targetPhoto from "@/assets/target-trening/target-hero.webp";
import iconTrust from "@/assets/target-trening/benefit-trust.webp";
import iconFlight from "@/assets/target-trening/benefit-flight.webp";
import iconHandling from "@/assets/target-trening/benefit-handling.webp";

import { targetIntro, targetSteps, targetBenefits } from "./steps";

import styles from "./VolneKridlaTarget.module.css";

const benefitIcons = [iconTrust, iconFlight, iconHandling];

export default function VolneKridlaTarget() {
  return (
    <Section id="target" className={styles.section}>
      <Container>
        <Stack direction="column" align="center" gap="xs" className={styles.heading}>
          <Badge>Čo je to ten target tréning?</Badge>
        </Stack>

        <Squircle radius="2xl" className={styles.card}>
          <Squircle radius="lg" className={styles.mediaPanel}>
            <Image src={targetPhoto} alt="Target tréning s papagájom" className={styles.mediaImage} />
          </Squircle>

          <Box className={styles.infoPanel}>
            <Text as="h2" variant="sectionTitle" className={styles.infoTitle}>
              Target tréning
            </Text>
            <Text as="p" variant="body" className={styles.infoText}>
              {targetIntro}
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
            Ako prebieha target tréning?
          </Text>

          <Stack direction="column" gap="sm">
            {targetSteps.map((step) => (
              <Text as="p" variant="body" key={step} className={styles.ruleItem}>
                {step}
              </Text>
            ))}
          </Stack>
        </Squircle>

        <Stack direction="column" align="center" gap="xs" className={styles.benefitsHeading}>
          <Badge>Výhody target tréningu</Badge>
        </Stack>

        <Box className={styles.benefitsRow}>
          {targetBenefits.map((benefit, index) => (
            <Squircle
              key={benefit.title}
              radius="md"
              className={styles.benefitCard}
              borderWidth={4}
              borderColor="var(--color-border-primary)"
            >
              <Image src={benefitIcons[index]} alt="" className={styles.benefitIcon} />
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
