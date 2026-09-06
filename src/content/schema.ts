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

export interface Product {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  /** resolved image URL (media bucket or external); "" if none */
  image: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqContent {
  tipy: FaqEntry[];
  otazky: FaqEntry[];
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
  heroCarousel: CarouselSlide[];
  reviews: Review[];
  faq: FaqContent;
  products: Product[];
}

export const EMPTY_SITE: SiteContent = {
  publishedAt: null,
  blocks: {},
  gallery: [],
  heroCarousel: [],
  reviews: [],
  faq: { tipy: [], otazky: [] },
  products: [],
};
