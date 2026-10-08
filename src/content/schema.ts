// Shape of the site content document. The build step (scripts/fetch-content.mjs)
// produces site.generated.json in this shape from Supabase; src/content/site.json
// is the committed fallback used when Supabase is not configured yet.

export interface GalleryImage {
  id: string;
  /** Fully resolved public URL (Supabase Storage) or a bundled asset path. */
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** smaller copy for grids; absent on photos uploaded before thumbnails existed */
  thumb?: string;
  /** "<thumb> <w>w, <src> <w>w" so the browser picks a sharp enough file */
  srcSet?: string;
  /** album the photo belongs to; absent = shown loose on /fotogaleria */
  albumId?: string;
}

export interface GalleryAlbum {
  id: string;
  /** URL segment: /fotogaleria/<slug> */
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) of the event, if set */
  date?: string;
  /** grid-sized URL of the cover photo */
  cover: string;
  coverSrcSet?: string;
  count: number;
}

export interface CarouselSlide {
  id: string;
  src: string;
  alt: string;
}

export interface Review {
  id: string;
  author: string;
  body: string;
  /** resolved image URL (media bucket or external); "" if none */
  image: string;
}

export interface ProductVariant {
  /** admin-chosen name, e.g. "Farba ľadvinky", "Veľkosť" */
  label: string;
  /** when true, options are color names from the shared palette (see colorPalette.ts) */
  isColor?: boolean;
  options: string[];
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  description: string;
  priceLabel: string;
  /** resolved image URL (media bucket or external); "" if none. primary image for card. */
  image: string;
  /** carousel images (multiple images for detail view) */
  images?: string[];
  variants?: ProductVariant[];
  inStock?: boolean;
  stockCount?: number;
  /** category slug, e.g. "trening" / "lietanie"; "" = uncategorized. See src/content/categories.ts. */
  category?: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqContent {
  tipy: FaqEntry[];
  otazky: FaqEntry[];
}

/** Whole-section visibility toggled in the admin (site_sections table). */
export interface SectionVisibility {
  tipy: boolean;
}

/**
 * Editable rich text / plain text blocks, addressed by a stable dotted key,
 * e.g. "home.hero.title". Kept as a flat map so new editable spots don't need
 * a schema change.
 */
export type ContentBlocks = Record<string, string>;

export interface SiteContent {
  /** Monotonic-ish marker for cache-busting / "last published" display. */
  publishedAt: string | null;
  blocks: ContentBlocks;
  gallery: GalleryImage[];
  /** newest event first; photos reference them via GalleryImage.albumId */
  albums: GalleryAlbum[];
  heroCarousel: CarouselSlide[];
  reviews: Review[];
  faq: FaqContent;
  sections: SectionVisibility;
  products: Product[];
}

export const EMPTY_SITE: SiteContent = {
  publishedAt: null,
  blocks: {},
  gallery: [],
  albums: [],
  heroCarousel: [],
  reviews: [],
  faq: { tipy: [], otazky: [] },
  sections: { tipy: false },
  products: [],
};
