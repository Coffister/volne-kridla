import { useNavigate } from "react-router-dom";
import { Container, Stack, Text, Section } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Button from "@/ui/components/Button";

import styles from "./Placeholder.module.css";

interface PlaceholderProps {
  title: string;
}

// stand-in for a sub-page that doesn't have real content yet
export default function Placeholder({ title }: PlaceholderProps) {
  const navigate = useNavigate();

  return (
    <Section className={styles.section}>
      <Container>
        <Stack direction="column" align="center" gap="md">
          <Text as="h1" variant="sectionTitle" className={styles.title}>
            {title}
          </Text>
          <Badge>Táto stránka sa pripravuje</Badge>
          <Text as="p" variant="body" className={styles.text}>
            Pracujeme na tom, aby tu čoskoro bolo viac. Medzitým sa môžeš vrátiť domov.
          </Text>
          <Button variant="primary" onClick={() => navigate("/")}>
            Späť domov
          </Button>
        </Stack>
      </Container>
    </Section>
  );
}
