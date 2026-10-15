# Capture scripts

How the frames in `assets/cap/` were produced (run from `showcase/`, needs `playwright` + Chromium; output lands in `.capture/`, gitignored):

1. Website + consultation form — live volnekridla.sk, DPR 2, form is **never submitted**: `cap2.mjs`, `cap4.mjs` (navbar without CTA), `cap5.mjs` (full page without the fixed navbar, all images loaded).
2. Admin — real admin UI from a local Vite build pointed at a mocked Supabase (`mock.mjs`), filled with the real published reviews / albums / photos scraped from the live site into `.capture/live2.json` and `.capture/media/`:
   `VITE_SUPABASE_URL=http://mock.supabase.test VITE_SUPABASE_ANON_KEY=mock npx vite --port 5174`, then `cap3.mjs`, `cap6.mjs`.
3. PNG → WebP (q92–94, alpha layers cropped to their bounding box); positions are in `index.html`.
