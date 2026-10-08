import { Link } from "react-router-dom";

import { Container, Section, Stack, Text } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import type { GalleryAlbum } from "@/content";
import { site } from "@/content";

import PhotoGrid from "./PhotoGrid";
import { formatEventDate } from "./formatDate";
import styles from "./Fotogaleria.module.css";

export default function Album({ album }: { album: GalleryAlbum }) {
  const photos = site.gallery.filter((g) => g.albumId === album.id);

  return (
    <Section id="fotogaleria-album" className={styles.section}>
      <Container>
        <Link to="/fotogaleria" className={styles.back}>
          ← Všetky albumy
        </Link>

        <Stack direction="column" align="center" gap="sm" className={styles.heading}>
          <Text as="h1" variant="sectionTitle" className={styles.albumHeading}>
            {album.title}
          </Text>
          {album.date && <Badge>{formatEventDate(album.date)}</Badge>}
          {album.description && (
            <Text as="p" variant="body" className={styles.description}>
              {album.description}
            </Text>
          )}
        </Stack>

        <PhotoGrid photos={photos} />
      </Container>
    </Section>
  );
}
