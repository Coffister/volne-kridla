import type { Icon } from "@phosphor-icons/react";
import { HouseLine, ChatCircleDots, Handshake, Sparkle } from "@phosphor-icons/react";

import { Box, Container, Stack, Text, Section, Squircle } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";

import styles from "./PreSkolyProgram.module.css";
import { PRE_SKOLY_CONTAINER } from "@/pages/PreSkoly/layout";

// the original 7 talking points, grouped into 3 themes — each point survives
// as a small tag under its theme so nothing from the brief is lost
const themes: { icon: Icon; title: string; text: string; points: string[] }[] = [
  {
    icon: HouseLine,
    title: "Čo papagáj potrebuje",
    text: "Papagáj nie je stvorený na sedenie v klietke. V prírode denne nalieta kilometre, hľadá potravu a rieši problémy. Ukážeme si, ako mu aj doma dopriať pohyb, zamestnanie a bezpečné, podnetné prostredie, v ktorom je naozaj spokojný.",
    points: ["spokojnosť", "pohyb a lietanie", "zamestnanie", "bezpečné prostredie"],
  },
  {
    icon: ChatCircleDots,
    title: "Ako sa s nami rozpráva",
    text: "Papagáj hovorí celým telom: perím, zreničkami, postojom aj hlasom. Naučíme sa tieto signály čítať a pochopíme, prečo niekedy hryzie, kričí alebo ničí veci. Väčšinou nám tým chce niečo povedať.",
    points: ["reč tela", "hryzenie", "krik", "ničenie vecí"],
  },
  {
    icon: Handshake,
    title: "Dôvera, tréning a sloboda",
    text: "Vzťah s papagájom nestojí na príkazoch, ale na dôvere. Vysvetlíme, ako funguje tréning založený na rešpekte a čo v skutočnosti znamená dať papagájovi slobodu. Nielen lietať, ale aj vedieť, kam sa vrátiť.",
    points: ["dôvera", "tréning", "skutočná sloboda"],
  },
];

export default function PreSkolyProgram() {
  return (
    <Section id="program" className={styles.section}>
      <Container style={PRE_SKOLY_CONTAINER}>
        <Stack direction="column" align="center" className={styles.header}>
          <Badge>Čo vás čaká?</Badge>
        </Stack>

        <Squircle radius="2xl" className={styles.card} reveal="up">
          <Box className={styles.intro}>
            <Text as="h2" variant="sectionTitle" className={styles.title}>
              Život papagájov v prírode aj doma
            </Text>
            <Text as="p" variant="body" className={styles.text}>
              Vo Voľných krídlach prinášame zážitkové prezentácie pre školy,
              centrá voľného času, domovy seniorov, komunitné centrá a ďalšie
              organizácie. Spoločne nahliadneme do života papagájov v prírode aj
              doma. Ukážeme si:
            </Text>
          </Box>

          <div className={styles.grid} data-reveal="stagger">
            {themes.map(({ icon: ThemeIcon, title, text, points }, index) => (
              <Squircle key={title} radius={26} className={styles.theme}>
                <Stack direction="row" align="center" justify="space-between">
                  <span className={styles.themeIcon} aria-hidden>
                    <ThemeIcon size={30} weight="bold" />
                  </span>
                  <span className={styles.themeNumber} aria-hidden>
                    0{index + 1}
                  </span>
                </Stack>

                <Text as="h3" variant="cardTitle" className={styles.themeTitle}>
                  {title}
                </Text>
                <Text as="p" variant="caption" className={styles.themeText}>
                  {text}
                </Text>

                <ul className={styles.points}>
                  {points.map((point) => (
                    <li key={point} className={styles.point}>
                      {point}
                    </li>
                  ))}
                </ul>
              </Squircle>
            ))}
          </div>

          <Squircle radius={26} className={styles.note} reveal="up">
            <span className={styles.noteIcon} aria-hidden>
              <Sparkle size={28} weight="fill" />
            </span>
            <Text as="p" variant="body" className={styles.noteText}>
              <strong>Nebude to len rozprávanie.</strong> Prezentácie sú
              interaktívne, plné zaujímavostí, otázok a konkrétnych príkladov zo
              života s papagájmi. Obsah prispôsobíme veku aj publiku – deťom,
              mladým ľuďom aj seniorom.
            </Text>
          </Squircle>
        </Squircle>
      </Container>
    </Section>
  );
}
