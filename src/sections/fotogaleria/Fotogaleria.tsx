import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Container, Section, Stack, Text } from "@/ui/primitives";
import Badge from "@/ui/components/Badge";
import Lightbox from "@/ui/components/Lightbox";

import { galleryImages as fallbackGalleryImages } from "@/pages/Fotogaleria/images";
import { site, type GalleryAlbum } from "@/content";

import { GRID_SIZES, type GridPhoto } from "./PhotoGrid";
import { useColumnCount } from "./useColumnCount";
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

const albums = site.albums;

type Tile =
  | { kind: "album"; album: GalleryAlbum }
  | { kind: "photo"; photo: GridPhoto; index: number };

// Height of a tile relative to its column width — enough to balance the
// columns without measuring anything (photos carry their dimensions).
// Album card: 3:2 cover + padding and title/date block, ~0.95× its width.
function relativeHeight(tile: Tile): number {
  if (tile.kind === "album") return 0.95;
  const { width, height } = tile.photo;
  return width && height ? height / width : 1;
}

// Row-first masonry: every next tile goes into the currently shortest
// column. So albums lead across the top (newest first) and loose photos
// continue right beside them — unlike CSS columns, which would stack the
// albums down the first column.
function distribute(tiles: Tile[], columns: number): Tile[][] {
  const cols: Tile[][] = Array.from({ length: columns }, () => []);
  const heights = new Array<number>(columns).fill(0);
  for (const tile of tiles) {
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest].push(tile);
    heights[shortest] += relativeHeight(tile);
  }
  return cols;
}

export default function Fotogaleria() {
  const columnCount = useColumnCount();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const columns = useMemo(() => {
    const tiles: Tile[] = [
      ...albums.map((album) => ({ kind: "album" as const, album })),
      ...loosePhotos.map((photo, index) => ({ kind: "photo" as const, photo, index })),
    ];
    return distribute(tiles, columnCount);
  }, [columnCount]);

  return (
    <Section id="fotogaleria" className={styles.section}>
      <Container>
        <Stack direction="column" align="center" gap="sm" className={styles.heading}>
          <Text as="h1" variant="sectionTitle" className={styles.title}>
            Fotogaléria
          </Text>
          <Badge>Spoločné zážitky</Badge>
        </Stack>

        <div className={styles.masonry}>
          {columns.map((column, c) => (
            <div key={c} className={styles.masonryColumn}>
              {column.map((tile) =>
                tile.kind === "album" ? (
                  <AlbumCard key={tile.album.id} album={tile.album} />
                ) : (
                  <button
                    key={tile.photo.id}
                    type="button"
                    className={styles.item}
                    onClick={() => setActiveIndex(tile.index)}
                    aria-label={`Zväčšiť obrázok: ${tile.photo.alt}`}
                  >
                    <img
                      src={tile.photo.thumb ?? tile.photo.src}
                      srcSet={tile.photo.srcSet}
                      sizes={GRID_SIZES}
                      alt={tile.photo.alt}
                      width={tile.photo.width}
                      height={tile.photo.height}
                      loading="lazy"
                      decoding="async"
                      className={styles.image}
                    />
                  </button>
                ),
              )}
            </div>
          ))}
        </div>
      </Container>

      <Lightbox
        items={loosePhotos}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </Section>
  );
}

function AlbumCard({ album }: { album: GalleryAlbum }) {
  return (
    <Link to={`/fotogaleria/${album.slug}`} className={styles.album}>
      <span className={styles.albumCover}>
        {album.cover && (
          <img
            src={album.cover}
            srcSet={album.coverSrcSet}
            sizes={GRID_SIZES}
            alt=""
            loading="lazy"
            decoding="async"
          />
        )}
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
  );
}
