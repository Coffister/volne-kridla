# volnekridla.sk Migration Progress

## Stack
- React 18 + Vite 5
- React Router v6 (file-based route structure)
- CSS Modules (no Tailwind)
- Formspree (`@formspree/react`)
- Swiper.js v8
- GSAP 3
- React Helmet Async
- Vercel deployment (`vercel.json`)

---

## Phase 1 — Project Setup
- [x] Vite + React scaffold
- [x] All dependencies installed
- [x] Folder structure created
- [x] `src/styles/tokens.css` with design tokens
- [x] `src/styles/global.css` (Google Fonts, Font Awesome, reset)
- [x] `vercel.json` SPA rewrites
- [x] `.gitignore`
- [x] ESLint config

## Phase 2 — Shell / Layout
- [x] `Navbar` component with mobile hamburger
- [x] `Footer` component
- [x] React Router v6 routes (all 5 pages)
- [x] `HelmetProvider` wired in `main.jsx`

## Phase 3 — Page Placeholders
- [x] `/` — Domov (Hero, Features, CTA banner)
- [x] `/volne-kridla` — Services grid + BookingForm
- [x] `/o-mne` — Bio section with stats
- [x] `/fotogaleria` — Photo grid placeholder
- [x] `/blog` — Post listing + dynamic `/blog/:slug`

## Phase 4 — Shared Components
- [x] `Button` (primary / secondary / outline / ghost variants, sm/md/lg sizes)
- [x] `SectionHeader` (eyebrow + title + subtitle)
- [x] `BookingForm` (Formspree integration, success state)

## Phase 5 — Content Migration
- [ ] Copy real content from volnekridla.sk into page components
- [ ] Replace image placeholders with actual photos in `/src/assets/images/`
- [ ] Wire Swiper.js carousel in Fotogaléria
- [ ] Wire GSAP scroll animations (hero, section entrances)
- [ ] Add real blog post content + additional posts
- [ ] Update Formspree `formId` with real endpoint

## Phase 6 — SEO & Meta
- [ ] Add Open Graph tags to each page
- [ ] Add canonical URLs
- [ ] Add `robots.txt` and `sitemap.xml`
- [ ] Add structured data (JSON-LD) where applicable

## Phase 7 — Polish & Deploy
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsive QA (320px → 1440px)
- [ ] Lighthouse audit (target: Performance ≥ 90, A11y ≥ 95)
- [ ] Connect custom domain on Vercel
- [ ] DNS cutover

---

## Notes
- Formspree form ID: `YOUR_FORMSPREE_ID` — replace in `BookingForm.jsx`
- Font Awesome kit `1288581984` loaded via `global.css`
- GSAP to be initialised per-page with `useEffect` + `useRef` pattern
- Swiper CSS import goes in the component that needs it (`Fotogaleria.jsx`)
