import { FacebookLogo } from "@phosphor-icons/react";

import { Stack, Text } from "@/ui/primitives";
import LinkButton from "@/ui/components/LinkButton";

import styles from "./Fotogaleria.module.css";

// the page linked from the current volnekridla.sk (WordPress) site
const FACEBOOK_URL = "https://www.facebook.com/people/Volne-Kridla/61573806387748/";

// closes the gallery and every album: whoever just browsed the event photos
// is the most likely person to want to be at the next one
export default function FacebookCta() {
  return (
    <aside className={styles.cta} aria-label="Ďalšia akcia">
      <Stack direction="column" align="center" gap="sm">
        <Text as="h2" variant="cardTitle" className={styles.ctaTitle}>
          Chceš byť na fotkách z ďalšej akcie?
        </Text>
        <Text as="p" variant="body" className={styles.ctaText}>
          Spoločné lietanie, tréningy aj stretnutia majiteľov papagájov
          ohlasujeme najskôr na Facebooku. Sleduj nás a o najbližšej akcii sa
          dozvieš medzi prvými.
        </Text>
        <LinkButton
          href={FACEBOOK_URL}
          target="_blank"
          variant="primary"
          size="sm"
          weight="bold"
          className={styles.ctaButton}
          icon={<FacebookLogo size={22} weight="fill" />}
        >
          Sledovať na Facebooku
        </LinkButton>
      </Stack>
    </aside>
  );
}
