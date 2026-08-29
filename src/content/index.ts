import { EMPTY_SITE, type SiteContent } from "./schema";
import fallback from "./site.json";

// Prefer the build-time snapshot pulled from Supabase; fall back to the
// committed seed when it doesn't exist (e.g. local dev before Supabase setup,
// or a Vercel build with no env vars). The glob keeps the import optional so
// a missing file is not a build error.
const generated = Object.values(
  import.meta.glob<{ default: SiteContent }>("./site.generated.json", {
    eager: true,
  }),
)[0]?.default;

export const site: SiteContent = {
  ...EMPTY_SITE,
  ...(generated ?? (fallback as SiteContent)),
};

export function block(key: string, fallbackText = ""): string {
  return site.blocks[key] ?? fallbackText;
}

export type { SiteContent, GalleryImage, CarouselSlide } from "./schema";
