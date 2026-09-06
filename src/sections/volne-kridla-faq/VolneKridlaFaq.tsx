import { useState } from "react";

import { qna as fallbackQna, tips as fallbackTips, type QnaItem } from "./faq";
import FaqItem from "./FaqItem";

import { Box, Container, Section, Stack } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import { site } from "@/content";

import styles from "./VolneKridlaFaq.module.css";

// Prefer questions managed in the admin (baked in at build time); fall back
// to the hardcoded copy per group until that group has published items.
const tips = site.faq.tipy.length ? site.faq.tipy : fallbackTips;
const qna = site.faq.otazky.length ? site.faq.otazky : fallbackQna;

interface FaqGroupProps {
  id: string;
  badge: string;
  items: QnaItem[];
}

function FaqGroup({ id, badge, items }: FaqGroupProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const middle = Math.ceil(items.length / 2);
  const leftColumn = items.slice(0, middle);
  const rightColumn = items.slice(middle);

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <div id={id} className={styles.group}>
      <Stack className={styles.heading} gap="xs" align="center">
        <Badge>{badge}</Badge>
      </Stack>

      <Box className={styles.columns}>
        <Stack className={styles.column} gap="xs">
          {leftColumn.map((item, index) => (
            <FaqItem
              key={item.question}
              {...item}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </Stack>

        <Stack className={styles.column} gap="xs">
          {rightColumn.map((item, index) => (
            <FaqItem
              key={item.question}
              {...item}
              isOpen={openIndex === middle + index}
              onToggle={() => toggle(middle + index)}
            />
          ))}
        </Stack>
      </Box>
    </div>
  );
}

export default function VolneKridlaFaq() {
  return (
    <Section id="faq">
      <Container>
        <div className={styles.groups}>
          <FaqGroup id="tipy" badge="Tipy, triky a zaujímavosti" items={tips} />
          <FaqGroup id="otazky" badge="Najčastejšie otázky" items={qna} />
        </div>
      </Container>
    </Section>
  );
}
