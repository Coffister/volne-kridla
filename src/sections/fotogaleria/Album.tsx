import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";

import { Container, Section, Stack, Text } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Button from "@/ui/components/Button";
import type { GalleryAlbum } from "@/content";
import { site } from "@/content";

import PhotoGrid from "./PhotoGrid";
import { formatEventDate } from "./formatDate";
import styles from "./Fotogaleria.module.css";

export default function Album({ album }: { album: GalleryAlbum }) {
  const navigate = useNavigate();
  const photos = site.gallery.filter((g) => g.albumId === album.id);

  return (
    <Section id="fotogaleria-album" className={styles.section}>
      <Container>
        <div className={styles.back}>
          <Button
            variant="primary"
            className={styles.backButton}
            icon={<ArrowLeft size={18} weight="bold" />}
            onClick={() => navigate("/fotogaleria")}
          >
            Späť do fotogalérie
          </Button>
        </div>

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
