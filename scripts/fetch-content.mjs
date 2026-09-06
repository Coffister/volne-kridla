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
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../src/content/site.generated.json");

// Local dev convenience: pick up .env.local / .env if present. On Vercel these
// files don't exist and the real environment is used instead.
for (const name of [".env.local", ".env"]) {
  const p = resolve(__dirname, "..", name);
  if (existsSync(p)) {
    try {
      process.loadEnvFile(p);
    } catch {
      /* ignore malformed env file */
    }
  }
}

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
  const [contentRes, galleryRes, reviewsRes, faqRes, productsRes] = await Promise.all([
    supabase.from("site_content").select("data").eq("id", 1).single(),
    supabase
      .from("gallery_images")
      .select("id, storage_path, alt, width, height, sort_order, published")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("reviews")
      .select("id, author, body, image_path, image_url, sort_order, published")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("faq_items")
      .select("id, group_key, question, answer, sort_order, published")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("products")
      .select("id, name, description, price_label, image_path, image_url, sort_order, published")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (contentRes.error) throw contentRes.error;
  if (galleryRes.error) throw galleryRes.error;
  // reviews / faq_items / products tables may not exist yet on a fresh project — treat as empty
  const reviewRows = reviewsRes.error ? [] : (reviewsRes.data ?? []);
  const faqRows = faqRes.error ? [] : (faqRes.data ?? []);
  const productRows = productsRes.error ? [] : (productsRes.data ?? []);

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

  const reviews = reviewRows.map((row) => ({
    id: row.id,
    author: row.author ?? "",
    body: row.body ?? "",
    image: row.image_path
      ? publicUrl(row.image_path)
      : (row.image_url ?? ""),
  }));

  const faq = {
    tipy: faqRows
      .filter((row) => row.group_key === "tipy")
      .map((row) => ({ question: row.question, answer: row.answer })),
    otazky: faqRows
      .filter((row) => row.group_key === "otazky")
      .map((row) => ({ question: row.question, answer: row.answer })),
  };

  const products = productRows.map((row) => ({
    id: row.id,
    name: row.name ?? "",
    description: row.description ?? "",
    priceLabel: row.price_label ?? "",
    image: row.image_path ? publicUrl(row.image_path) : (row.image_url ?? ""),
  }));

  const out = {
    publishedAt: new Date().toISOString(),
    blocks: data.blocks ?? {},
    gallery,
    heroCarousel,
    reviews,
    faq,
    products,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");

  console.log(
    `[fetch-content] wrote ${OUT} — ${gallery.length} images, ` +
      `${reviews.length} reviews, ${faqRows.length} faq items, ` +
      `${products.length} products, ${Object.keys(out.blocks).length} text blocks.`,
  );
} catch (err) {
  console.error("[fetch-content] failed:", err.message || err);
  // Don't fail the whole build over a content-fetch problem (bad/rotated
  // Supabase key, RLS change, outage, ...) — that would block every deploy,
  // including unrelated code fixes, until someone notices and fixes Supabase.
  // Fall back to the last committed snapshot and ship a slightly stale site
  // instead of no site.
  console.warn(
    "[fetch-content] falling back to committed src/content/site.json — " +
      "the live site will show stale content until this is fixed.",
  );
  process.exit(0);
}
