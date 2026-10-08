import { Link } from "react-router-dom";

import { Container, Section, Stack, Text } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";

import { galleryImages as fallbackGalleryImages } from "@/pages/Fotogaleria/images";
import { site } from "@/content";

import PhotoGrid from "./PhotoGrid";
import { formatEventDate } from "./formatDate";
import styles from "./Fotogaleria.module.css";

// Prefer images managed in the admin (baked in at build time); fall back to
// the hardcoded set until the gallery table has published images.
const loosePhotos = site.gallery.length
  ? site.gallery.filter((g) => !g.albumId)
  : fallbackGalleryImages;

// 1 fotka, 2–4 fotky, 5+ fotiek
function photoCount(n: number) {
  return `${n} ${n === 1 ? "fotka" : n >= 2 && n <= 4 ? "fotky" : "fotiek"}`;
}

// albums always come first, newest event on top; loose photos follow
const albums = site.albums;

export default function Fotogaleria() {
  return (
    <Section id="fotogaleria" className={styles.section}>
      <Container>
        <Stack direction="column" align="center" gap="sm" className={styles.heading}>
          <Text as="h1" variant="sectionTitle" className={styles.title}>
            Fotogaléria
          </Text>
          <Badge>Spoločné zážitky</Badge>
        </Stack>

        {albums.length > 0 && (
          <ul className={styles.albums}>
            {albums.map((album) => (
              <li key={album.id}>
                <Link to={`/fotogaleria/${album.slug}`} className={styles.album}>
                  <span className={styles.albumCover}>
                    {album.cover && <img src={album.cover} alt="" loading="lazy" decoding="async" />}
                    <span className={styles.albumCount}>{photoCount(album.count)}</span>
                  </span>
                  <span className={styles.albumMeta}>
                    <Text as="span" variant="cardTitle" className={styles.albumTitle}>
                      {album.title}
                    </Text>
                    {album.date && (
                      <Text as="span" variant="caption" className={styles.albumDate}>
                        {formatEventDate(album.date)}
                      </Text>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {loosePhotos.length > 0 && (
          <>
            {albums.length > 0 && (
              <Text as="h2" variant="cardTitle" className={styles.subheading}>
                Ďalšie fotky
              </Text>
            )}
            <PhotoGrid photos={loosePhotos} />
          </>
        )}
      </Container>
    </Section>
  );
}
