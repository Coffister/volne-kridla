import type { Icon } from "@phosphor-icons/react";
import {
  Heart,
  ChatCircleDots,
  Question,
  Handshake,
  Bird,
  HouseLine,
  Feather,
  Sparkle,
} from "@phosphor-icons/react";

import { Box, Container, Stack, Text, Section, Squircle } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";

import styles from "./PreSkolyProgram.module.css";

const topics: { icon: Icon; text: string }[] = [
  { icon: Heart, text: "čo papagáj potrebuje, aby bol spokojný" },
  { icon: ChatCircleDots, text: "ako komunikuje a čo nám hovorí rečou tela" },
  { icon: Question, text: "prečo hryzie, kričí alebo ničí veci" },
  { icon: Handshake, text: "ako funguje dôvera a tréning" },
  { icon: Bird, text: "prečo potrebuje pohyb, lietanie a zamestnanie" },
  { icon: HouseLine, text: "ako mu vytvoriť bezpečné a podnetné prostredie" },
  { icon: Feather, text: "čo znamená dať papagájovi skutočnú slobodu" },
];

export default function PreSkolyProgram() {
  return (
    <Section id="program" className={styles.section}>
      <Container>
        <Stack direction="column" align="center" className={styles.header}>
          <Badge>Čo vás čaká?</Badge>
        </Stack>

        <Squircle radius="2xl" className={styles.card}>
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

          <ul className={styles.grid}>
            {topics.map(({ icon: TopicIcon, text }) => (
              <li key={text}>
                <Squircle radius={18} className={styles.topic}>
                  <span className={styles.topicIcon} aria-hidden>
                    <TopicIcon size={26} weight="bold" />
                  </span>
                  <Text as="span" variant="body" className={styles.topicText}>
                    {text}
                  </Text>
                </Squircle>
              </li>
            ))}
          </ul>

          <Squircle radius={26} className={styles.note}>
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
