import { useEffect, useState } from "react";

import Button from "@/ui/components/Button";
import LinkButton from "@/ui/components/LinkButton";
import Badge from "@/ui/components/Badge";
import Card from "@/ui/components/Card";
import Squircle from "@/ui/primitives/Squircle";
import Text from "@/ui/primitives/Text";

import { colors } from "@/ui/foundation/colors";
import { spacing } from "@/ui/foundation/spacing";
import { radius } from "@/ui/foundation/radius";
import { typography } from "@/ui/foundation/typography";
import { fontWeight } from "@/ui/foundation/fontWeight";
import { lineHeight } from "@/ui/foundation/lineHeight";

import type { ButtonSize, ButtonVariant } from "@/ui/components/Button/recipe";

import styles from "./Playground.module.css";

const buttonVariants: ButtonVariant[] = ["primary", "secondary", "ghost", "label", "contact"];
const buttonSizes: ButtonSize[] = ["sm", "md", "lg", "label"];

const colorGroups = Object.entries(colors) as [string, Record<string, string>][];
const spacingEntries = Object.entries(spacing) as [string, number][];
const radiusEntries = Object.entries(radius) as [string, number][];
const typographyEntries = Object.entries(typography) as [string, Record<string, unknown>][];
const fontWeightEntries = Object.entries(fontWeight) as [string, number][];
const lineHeightEntries = Object.entries(lineHeight) as [string, number][];

// resolves each `var(--color-x)` token to its current computed hex so edits to variables.css show up live
function useResolvedColorValues() {
  const [resolved, setResolved] = useState<Record<string, string>>({});

  useEffect(() => {
    const resolve = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};

      for (const [, values] of colorGroups) {
        for (const value of Object.values(values)) {
          const match = value.match(/var\((--[^)]+)\)/);
          if (!match) continue;

          const resolvedValue = rootStyles.getPropertyValue(match[1]).trim();
          next[value] = resolvedValue || value;
        }
      }

      setResolved(next);
    };

    resolve();
    const interval = setInterval(resolve, 300);
    return () => clearInterval(interval);
  }, []);

  return resolved;
}

// live preview of every design token and core component variant
export default function Playground() {
  const resolvedColors = useResolvedColorValues();

  return (
    <div className={styles.page}>
      <Text as="h1" variant="sectionTitle" className={styles.title}>
        Design Playground
      </Text>

      <section className={styles.section}>
        <Text as="h2" variant="cardTitle" className={styles.sectionTitle}>
          Colors
        </Text>
        {colorGroups.map(([group, values]) => (
          <div key={group} className={styles.grid} style={{ marginBottom: 16 }}>
            {Object.entries(values).map(([name, token]) => (
              <div className={styles.swatch} key={`${group}-${name}`}>
                <div className={styles.swatchColor} style={{ background: token }} />
                <Text as="span" variant="caption" className={styles.swatchLabel}>
                  {group}.{name} — {resolvedColors[token] ?? token}
                </Text>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <Text as="h2" variant="cardTitle" className={styles.sectionTitle}>
          Spacing
        </Text>
        {spacingEntries.map(([name, value]) => (
          <div className={styles.scaleBar} key={name}>
            <div className={styles.scaleBox} style={{ width: value, height: 16 }} />
            <Text as="span" variant="caption" className={styles.scaleLabel}>
              {name} — {value}px
            </Text>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <Text as="h2" variant="cardTitle" className={styles.sectionTitle}>
          Radius
        </Text>
        <div className={styles.row}>
          {radiusEntries.map(([name, value]) => (
            <div key={name} className={styles.swatch}>
              <div className={styles.radiusBox} style={{ borderRadius: value }}>
                {value}px
              </div>
              <Text as="span" variant="caption" className={styles.swatchLabel}>
                {name}
              </Text>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <Text as="h2" variant="cardTitle" className={styles.sectionTitle}>
          Squircle radii
        </Text>
        <div className={styles.row}>
          {(["sm", "md", "lg", "xl"] as const).map((r) => (
            <Squircle key={r} radius={r}>
              <div className={styles.radiusBox}>{r}</div>
            </Squircle>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <Text as="h2" variant="cardTitle" className={styles.sectionTitle}>
          Typography
        </Text>
        {typographyEntries.map(([name]) => (
          <div key={name} className={styles.typographyRow}>
            <Text as="p" variant={name as keyof typeof typography}>
              {name} — The quick brown fox jumps over the lazy dog
            </Text>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <Text as="h2" variant="cardTitle" className={styles.sectionTitle}>
          Font weight
        </Text>
        {fontWeightEntries.map(([name, value]) => (
          <div key={name} className={styles.typographyRow}>
            <Text as="p" variant="body" style={{ fontWeight: value }}>
              {name} ({value}) — The quick brown fox
            </Text>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <Text as="h2" variant="cardTitle" className={styles.sectionTitle}>
          Line height
        </Text>
        {lineHeightEntries.map(([name, value]) => (
          <div key={name} className={styles.typographyRow}>
            <Text as="p" variant="body" style={{ lineHeight: value, maxWidth: 480 }}>
              {name} ({value}) — The quick brown fox jumps over the lazy dog and
              keeps on running through the meadow.
            </Text>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <Text as="h2" variant="cardTitle" className={styles.sectionTitle}>
          Buttons
        </Text>
        {buttonVariants.map((variant) => (
          <div className={styles.row} key={variant} style={{ marginBottom: 16 }}>
            <Text as="span" variant="caption" style={{ width: 90 }}>
              {variant}
            </Text>
            {buttonSizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {size}
              </Button>
            ))}
            <Button variant={variant} disabled>
              disabled
            </Button>
          </div>
        ))}

        <div className={styles.row}>
          <LinkButton href="#" variant="primary">
            Link button
          </LinkButton>
        </div>
      </section>

      <section className={styles.section}>
        <Text as="h2" variant="cardTitle" className={styles.sectionTitle}>
          Badge
        </Text>
        <div className={styles.badgeRow}>
          <Badge>Default badge</Badge>
          <Badge>Another label</Badge>
        </div>
      </section>

      <section className={styles.section}>
        <Text as="h2" variant="cardTitle" className={styles.sectionTitle}>
          Card
        </Text>
        <div className={styles.card}>
          <Card>
            <Text as="h3" variant="cardTitle">
              Card title
            </Text>
            <Text as="p" variant="body">
              Card body content preview.
            </Text>
          </Card>
        </div>
      </section>
    </div>
  );
}
