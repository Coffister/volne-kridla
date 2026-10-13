import { useLocation, useNavigate } from "react-router-dom";
import { Container, Stack, Text, Section } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Button from "@/ui/components/Button";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

import styles from "@/pages/Placeholder/Placeholder.module.css";

// Catch-all for unknown URLs. On Vercel these are served from dist/404.html
// with a real 404 status (see vercel.json); this just gives the visitor a way
// back instead of an empty page.
export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  useDocumentMeta({
    title: "Stránka sa nenašla",
    description: "Táto stránka neexistuje.",
    path: location.pathname,
    noindex: true,
  });

  return (
    <Section className={styles.section}>
      <Container>
        <Stack direction="column" align="center" gap="md">
          <Badge>404</Badge>
          <Text as="h1" variant="sectionTitle" className={styles.title}>
            Táto stránka uletela
          </Text>
          <Text as="p" variant="body" className={styles.text}>
            Adresa, ktorú hľadáte, neexistuje alebo sa presunula.
          </Text>
          <Stack direction="row" align="center" gap="sm" wrap="wrap">
            <Button variant="primary" onClick={() => navigate("/")}>
              Späť domov
            </Button>
            <Button variant="secondary" onClick={() => navigate("/volne-kridla")}>
              Kurz voľného lietania
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
