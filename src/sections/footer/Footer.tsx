import { Box, Stack, Text, Section } from "@/ui/primitives";

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <Section className={styles.footer}>
      <Box w="100%">
        <Stack
          direction="row"
          align="center"
          justify="space-between"
          className={styles.inner}
        >
          <Text as="span" variant="caption" weight="bold" className={styles.text}>
            © Voľné Krídla | 2025
          </Text>
          <Text as="span" variant="caption" weight="bold" className={styles.text}>
            Webstránku vytvoril Coffister
          </Text>
        </Stack>
      </Box>
    </Section>
  );
}
