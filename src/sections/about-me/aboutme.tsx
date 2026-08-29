import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Section,
  Squircle,
} from "@/ui/primitives";
import Button from "@/ui/components/Button";
import Badge from "@/ui/components/Badge";

import aboutfranka from "@/assets/core/franka.jpg";

import styles from "./aboutme.module.css";

export default function AboutMe() {
  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <Stack direction="row" justify="center" align="center" className={styles.badge}>
          <Badge>Kto vlastne som?</Badge>
        </Stack>

        <Box>
          <Squircle radius="2xl">
            <Stack className={styles.aboutCard} direction="row" align="stretch">
              <Squircle radius="md" className={styles.mediaPanel}>
                <Image
                  src={aboutfranka}
                  alt="franka"
                  className={styles.mediaImage}
                />
              </Squircle>
              <Squircle className={styles.contentPanel} radius="xl">
                <Stack
                  direction="column"
                  gap="md"
                  className={styles.inner}
                >
                  <Text as="h1" variant="sectionTitle">
                    Ahoj, volám sa Franka
                  </Text>
                  <Text as="p" className={styles.innerBody} variant="body">
                    a mojou vášňou sú tieto inteligentné operené tvory, venujem
                    sa ich výchove no najmä tréningu voľného letu.
                    {"\n\n"}
                    Môj príbeh začal s prvým papagájom žakom, ktorého som
                    vychovávala od mláďaťa, Cez jeho výchovu som pochopila, aká
                    dôležitá je správna komunikácia a pochopenie prirodzených
                    inštiktov papagájov. Postupne sa moja vášeň rozrástla na
                    prácu s ďalšími operenými letcami od koreliek až po veľké
                    ary.
                    {"\n\n"}
                    Ak chceš, aby aj tvoj papagáj zažil skutočnú slobodu, pridaj
                    sa k nám
                  </Text>
                  <Button variant="primary" size="sm">Zisti o mne viac</Button>
                </Stack>
              </Squircle>
            </Stack>
          </Squircle>
        </Box>
      </Container>
    </Section>
  );
}
