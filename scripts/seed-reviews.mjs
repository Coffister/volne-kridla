// One-time seed: copy the hardcoded testimonials into the `reviews` table.
// Safe to run repeatedly — it does nothing if the table already has rows.
//
//   node scripts/seed-reviews.mjs
//
// Needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (picked up from .env.local).

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

for (const name of [".env.local", ".env"]) {
  const p = resolve(__dirname, "..", name);
  if (existsSync(p)) {
    try {
      process.loadEnvFile(p);
    } catch {
      /* ignore */
    }
  }
}

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { count, error: countErr } = await supabase
  .from("reviews")
  .select("*", { count: "exact", head: true });
if (countErr) {
  console.error("Cannot read reviews table (did you run 0002_reviews.sql?):", countErr.message);
  process.exit(1);
}
if ((count ?? 0) > 0) {
  console.log(`reviews already has ${count} rows — nothing to seed.`);
  process.exit(0);
}

const srcPath = resolve(
  __dirname,
  "../src/sections/testimonials/testimonial-map.ts",
);
const src = await readFile(srcPath, "utf8");
const match = src.match(/export const testimonials[^=]*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find `testimonials` array in", srcPath);
  process.exit(1);
}
/** @type {{id:string,clientName:string,text:string,image:string}[]} */
const testimonials = eval(match[1]);

const rows = testimonials.map((t, i) => ({
  author: t.clientName,
  body: t.text,
  image_url: t.image || null,
  image_path: null,
  sort_order: i,
  published: true,
}));

const { error } = await supabase.from("reviews").insert(rows);
if (error) {
  console.error("Insert failed:", error.message);
  process.exit(1);
}
console.log(`Seeded ${rows.length} reviews.`);
