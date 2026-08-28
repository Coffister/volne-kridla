// Build-time content snapshot.
//
// Pulls the published site content + media library from Supabase and writes
// src/content/site.generated.json, which the app prefers over the committed
// src/content/site.json fallback.
//
// Runs before `vite build` (see package.json). If Supabase env vars are not
// set, it logs a notice and exits 0 so the build still succeeds on the
// committed fallback — important for the very first Vercel deploy.

import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../src/content/site.generated.json");

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.warn(
    "[fetch-content] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — " +
      "using committed src/content/site.json fallback.",
  );
  process.exit(0);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

function publicUrl(path) {
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

try {
  const [contentRes, galleryRes] = await Promise.all([
    supabase.from("site_content").select("data").eq("id", 1).single(),
    supabase
      .from("gallery_images")
      .select("id, storage_path, alt, width, height, sort_order, published")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (contentRes.error) throw contentRes.error;
  if (galleryRes.error) throw galleryRes.error;

  const data = contentRes.data?.data ?? {};
  const gallery = (galleryRes.data ?? []).map((row) => ({
    id: row.id,
    src: publicUrl(row.storage_path),
    alt: row.alt ?? "",
    width: row.width ?? undefined,
    height: row.height ?? undefined,
  }));

  // heroCarousel is stored in the content document as an ordered list of
  // gallery_images ids; resolve them against the media library.
  const byId = new Map(gallery.map((g) => [g.id, g]));
  const heroCarousel = Array.isArray(data.heroCarousel)
    ? data.heroCarousel
        .map((ref) => byId.get(typeof ref === "string" ? ref : ref?.id))
        .filter(Boolean)
        .map((g) => ({ id: g.id, src: g.src, alt: g.alt }))
    : [];

  const out = {
    publishedAt: new Date().toISOString(),
    blocks: data.blocks ?? {},
    gallery,
    heroCarousel,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");

  console.log(
    `[fetch-content] wrote ${OUT} — ${gallery.length} images, ` +
      `${Object.keys(out.blocks).length} text blocks.`,
  );
} catch (err) {
  console.error("[fetch-content] failed:", err.message || err);
  // Fail the build: a broken snapshot is worse than a known-good fallback,
  // but a silent stale deploy is worst. Flip to `process.exit(0)` if you'd
  // rather always fall back.
  process.exit(1);
}
