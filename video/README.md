# Voľné krídla — mikrodemá (HyperFrames)

7 samostatných 6–8 s klipov pre kartu projektu v portfóliu. Exporty: `exports/*.mp4`
(1920×1080, 30 fps, H.264, bez zvuku, faststart).

`assets/` (≈50 MB snímok) nie je v gite — vytvorí ho `npm run capture`.

## Ako vznikajú

1. **Capture** (`capture/capture.mjs`, Playwright): reálne stavy UI v 1440×810 pri 2× DPR.
   - Verejné klipy z **live** volnekridla.sk. Zápisy (odoslanie dopytu, e-mailová
     funkcia) a analytika sú zachytené v prehliadači — nič sa nedostane do produkčnej
     DB, k majiteľke ani do Umami. Úspešný stav je skutočný krok 4 formulára, ktorý
     klientsky kód zobrazí po prijatí `201` (odpoveď vracia mock, nie Supabase).
   - Admin z **lokálneho** dev servera s anonymizovanými riadkami z mocku (`MOCK` v skripte).
     Kód adminu je skutočný; počty v Prehľade pochádzajú z obsahu publikovaného na live webe
     (`src/content/site.generated.json`, gitignored).
   - Scroll = sekvencia snímok z prehliadača → `*.mp4` (fixný navbar a pozadie sa správajú ako na webe).
   - `prefers-reduced-motion`: obsah sa nezobrazuje cez scroll-reveal, stránky sa prepínajú okamžite.
2. **Kompozície** (`clips/<klip>/index.html`): kamera, kurzor a prechody na jednej GSAP časovej osi;
   spoločné prvky v `shared/` (`stage.js`, `stage.css`, kurzor webu z `src/assets/cursor`).
3. **Render + kontrola**: `./render.sh` (HyperFrames `check` → `render` → `verify.py`).

```bash
# v koreni repa (admin capture potrebuje mock Supabase URL)
VITE_SUPABASE_URL=https://mock.supabase.co VITE_SUPABASE_ANON_KEY=mock npx vite --port 5173
# vo video/
npm ci && npx hyperframes browser ensure
npm run capture            # alebo: node capture/capture.mjs homepage admin-overview
npm run render             # alebo: ./render.sh homepage
```
