import { useState } from "react";

import Lightbox from "@/ui/components/Lightbox";

import styles from "./Fotogaleria.module.css";

export interface GridPhoto {
  id: string;
  /** full-size, shown in the lightbox */
  src: string;
  /** grid-sized copy; falls back to src */
  thumb?: string;
  alt: string;
  width?: number;
  height?: number;
}

// masonry grid of thumbnails; tapping one opens the full-size lightbox
export default function PhotoGrid({ photos }: { photos: GridPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className={styles.grid}>
        {photos.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className={styles.item}
            onClick={() => setActiveIndex(index)}
            aria-label={`Zväčšiť obrázok: ${image.alt}`}
          >
            <img
              src={image.thumb ?? image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
              className={styles.image}
            />
          </button>
        ))}
      </div>

      <Lightbox
        items={photos}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </>
  );
}
