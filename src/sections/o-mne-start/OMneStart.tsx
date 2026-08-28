import { Box, Container, Stack, Text, Section, Squircle, Image } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";

import startPhoto from "@/assets/omne/33522a32-d2bf-4703-8ebb-40d4f72b2be9.webp";

import styles from "./OMneStart.module.css";

export default function OMneStart() {
  return (
    <Section id="kde-to-zacalo" className={styles.section}>
      <Container>
        <Stack direction="column" align="center" gap="xs" className={styles.heading}>
          <Badge>Môj príbeh</Badge>
        </Stack>

        <Squircle radius="2xl" className={styles.card}>
          <Squircle radius="lg" className={styles.mediaPanel}>
            <Image
              src={startPhoto}
              alt="Franka počas svojich začiatkov s papagájmi"
              className={styles.mediaImage}
            />
          </Squircle>

          <Box className={styles.infoPanel}>
            <Text as="h2" variant="sectionTitle" className={styles.infoTitle}>
              Kde to celé začalo
            </Text>
            <Text as="p" variant="body" className={styles.infoText}>
              {
                "Myšlienka venovať sa voľnému lietaniu mi napadla počas dovolenky na ostrove Tenerife v roku 2011. V jednom zooparku som tam videla úžasnú šou s papagájmi trénovanými na voľné lietanie v prírode. Fascinovalo ma to natoľko, že hneď po návrate domov som sa do toho pustila s mojou prvou arou araraunou – Lolou. Neskôr sa pridal aj ara harlekýn Gino, korelky a ďalší naši „voľnoletci“."
              }
            </Text>
          </Box>
        </Squircle>
      </Container>
    </Section>
  );
}
