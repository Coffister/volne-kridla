import { useState } from "react";

import { qna as fallbackQna, tips as fallbackTips, type QnaItem } from "./faq";
import FaqItem from "./FaqItem";

import { Container, Section, Stack } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import { site } from "@/content";
import JsonLd from "@/lib/JsonLd";
import { visibility } from "@/content/visibility";

import styles from "./VolneKridlaFaq.module.css";

// Prefer questions managed in the admin (baked in at build time); fall back
// to the hardcoded copy per group until that group has published items.
const tips = site.faq.tipy.length ? site.faq.tipy : fallbackTips;
const qna = site.faq.otazky.length ? site.faq.otazky : fallbackQna;

// Only "otázky" is genuine FAQ schema material — "tipy" entries are article-style
// titles, not questions a visitor actually asked, so marking them up as FAQPage
// would misrepresent the content to search/AI crawlers.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: qna.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

interface FaqGroupProps {
  id: string;
  badge: string;
  items: QnaItem[];
}

function FaqGroup({ id, badge, items }: FaqGroupProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <div id={id} className={styles.group}>
      <Stack className={styles.heading} gap="xs" align="center">
        <Badge>{badge}</Badge>
      </Stack>

      {/* rows of two; flex-wrap + centring puts an odd last question in the
          middle, however many questions the admin adds */}
      <Stack
        direction="row"
        wrap="wrap"
        justify="center"
        align="flex-start"
        gap="xs"
        className={styles.list}
        reveal="stagger"
      >
        {items.map((item, index) => (
          <div key={item.question} className={styles.item}>
            <FaqItem {...item} isOpen={openIndex === index} onToggle={() => toggle(index)} />
          </div>
        ))}
      </Stack>
    </div>
  );
}

export default function VolneKridlaFaq() {
  return (
    // with only one group the content no longer fills the 100dvh minimum, and
    // Section would center it in empty space — let the padding define it instead
    <Section
      id="faq"
      style={visibility.showTipsAndTricks ? undefined : { minHeight: "auto" }}
    >
      <JsonLd data={FAQ_JSON_LD} />
      <Container>
        <div className={styles.groups}>
          {visibility.showTipsAndTricks && (
            <FaqGroup id="tipy" badge="Tipy, triky a zaujímavosti" items={tips} />
          )}
          <FaqGroup id="otazky" badge="Najčastejšie otázky" items={qna} />
        </div>
      </Container>
    </Section>
  );
}
