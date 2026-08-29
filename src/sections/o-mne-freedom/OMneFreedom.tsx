import { Box, Container, Text, Section, Squircle, Image } from "@/ui/primitives";

import freedomPhoto from "@/assets/omne/IMG_2756-1.jpg";

import styles from "./OMneFreedom.module.css";

export default function OMneFreedom() {
  return (
    <Section id="posledny-krok" className={styles.section}>
      <Container>
        <Squircle radius="2xl" className={styles.card}>
          <Squircle radius="lg" className={styles.mediaPanel}>
            <Image
              src={freedomPhoto}
              alt="Franka s papagájom a dieťaťom v prírode"
              className={styles.mediaImage}
            />
          </Squircle>

          <Box className={styles.infoPanel}>
            <Text as="h2" variant="sectionTitle" className={styles.infoTitle}>
              Volám sa Franka
            </Text>
            <Text as="p" variant="body" className={styles.infoText}>
              {
                "S papagájmi žijem už viac než dvadsať rokov. Naučila som sa od nich tak veľa, najmä načúvať im, rešpektovať a čítať čo nám hovoria aj keď sú ticho.\n\nMoje skúsenosti nevychádzajú iba z kníh či kurzov ale aj z členstva v talianskej organizácii L’Associazione Pappagalli in Volo, no predovšetkým je postavené na zdieľanom tichu, na malých každodenných gestách, na krízach a na víťazstvách.\n\nA potom…to bola ona – Lola (Ara ararauna)\n\nVerím, že to bola ona kto mi pomohol naozaj pochopiť niečo obrovské a to že prostredníctvom nás možno pomôcť mnohým ďalším ako ona. Je to príbeh, ktorý vám porozprávam neskôr, keď príde ten správny moment, pretože niektoré putá si zaslúžia byť rozprávané s plným srdcom a otvorenou mysľou. Ale vedzte, že to bolo vďaka nej, aspoň čiastočne, že som sa rozhodla zmeniť cestu. Dať do stredu nie výkon, ale vzťah. Nie účinok, ale ich podstatu."
              }
            </Text>
          </Box>
        </Squircle>
      </Container>
    </Section>
  );
}
