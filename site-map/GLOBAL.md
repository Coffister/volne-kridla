# GLOBAL — Voľné Krídla Site-Wide Elements

---

## Typography

| Font | Weights | Source | Role |
|------|---------|--------|------|
| **League Spartan** | 100–900 | Google Fonts | Primary headings |
| **Poppins** | 400, 500, 600, 700 | Google Fonts | Body / secondary text |
| **Roboto** | 100–900 | Google Fonts | UI / fallback |

Google Fonts URLs:
```
https://fonts.googleapis.com/css?family=League+Spartan:100,100italic,...,900italic&display=swap&subset=latin-ext
https://fonts.googleapis.com/css?family=Roboto:100,...,900italic&display=swap&subset=latin-ext
https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap
https://fonts.googleapis.com/css?family=Poppins:100,...,900italic&display=swap&subset=latin-ext
```

---

## Color Palette

| Hex | Usage |
|-----|-------|
| `#ffffff` / `#fff` | White background, text on dark |
| `#333333` / `#333` | Primary dark text |
| `#000000` / `#000` | Black accents |
| `#ffa629` | Orange — primary accent / CTA |
| `#2755aa` | Blue — secondary accent |
| `#ffffef` | Cream — section backgrounds |
| `#f5e5b3` | Warm yellow/cream — soft highlights |
| `#efefef` | Light grey — dividers / backgrounds |
| `#313131` | Near-black — dark sections |
| `#00d084` | Green — success / positive states |
| `#eee` | Very light grey — borders |

---

## Logo & Brand Assets

| Asset | URL |
|-------|-----|
| Logo (webp, border stroke) | https://volnekridla.sk/wp-content/uploads/2025/08/logo-border-stroke.webp |
| Logo SVG (v1) | https://volnekridla.sk/wp-content/uploads/2025/08/Volne-Kridla.svg |
| Logo SVG (v2) | https://volnekridla.sk/wp-content/uploads/2025/09/Volne-kridla.svg |

---

## Navigation (Header)

Sticky top navigation bar. Items:

```
Domov
Voľné krídla
  ├─ O voľnom lietaní        → /volne-kridla/#about
  ├─ Najčastejšie otázky     → /volne-kridla/#faq
  ├─ Tipy, triky a zaujímavosti → /volne-kridla/#tips
  └─ Target tréning          → ../volne-kridla/#target
O mne
Fotogaléria
Blog
[Button] Začať lietať        → #contact-form / #form
```

---

## Footer

```
© Voľné Krídla | 2025 Dizajn vytvoril Coffister
```

Minimal single-line footer. No secondary nav, no social links in footer (social is embedded mid-page).

---

## Recurring Contact/Booking Form

Present on every page as the final section, titled **"Posledný krok k slobode"**.

### Form Structure

**Step 1 — Consultation type** ("Vyberte spôsob konzultácie")
- `Online konzultácia` — video call, immediate application
- `Osobná konzultácia` — in-person meeting, observe the parrot

**Step 2 — Package selection** ("Vyberte balík")
- `Basic`
- `Premium`
- `Kurz voľného lietania` (Free-flight course)

**Step 3 — Contact details** ("Kontaktné údaje:")
- Meno (Name)
- Contact fields (phone/email)

**Step 4 — Parrot details** ("Údaje papagája:")
- Parrot-specific info fields

**Success state:**  
"Úspešne odoslanie formulára!" — "Ďakujem za vašu dôveru. Budem vás v krátkom čase kontaktovať telefonicky (zvyčajne do 48 hodín)…"

**GDPR notice:**  
"Odoslaním formulára beriete na vedomie, že poskytnuté osobné údaje (meno, kontaktné údaje a informácie uvedené v dotazníku) budú spracované výlučne za účelom kontaktovania…"

---

## Scripts & Plugins

### JavaScript Libraries

| Script | Version | Purpose |
|--------|---------|---------|
| jQuery | 3.7.1 | Core |
| jQuery Migrate | 3.4.1 | Compatibility |
| Font Awesome Kit | `1288581984` | Icons |
| GSAP | 3.12.5 | Animations |
| Swiper | v8.4.5 | Sliders / carousels |
| Particles.js | (WP Royal) | Particle effects |
| Jarallax | 1.12.7 | Parallax scrolling |
| Parallax.js | 1.0 | Parallax effects |
| SmoothScroll | 1.5.1 | Mousewheel smooth scroll |

### WordPress Plugins Detected

| Plugin | Version | Purpose |
|--------|---------|---------|
| Elementor | 4.1.3 | Page builder |
| Royal Elementor Addons (WPR) | 1.7.1063 | Elementor extensions (particles, parallax, modal popups) |
| Essential Addons for Elementor | 6.6.7 | Additional Elementor widgets |
| Cursor Plugin | — | Custom cursor behavior |
| Mousewheel Smooth Scroll | 1.5.1 | Smooth scrolling |
| Bluehost WordPress Plugin | — | Hosting performance (lazy load images, link prefetch) |
| Yoast SEO | — | SEO meta tags |
| WooCommerce | — | Detected (likely for payment/checkout of consultations) |
| Font Awesome | Kit | Icon library |

### Elementor Settings Noted
- Animations: `bounceInUp` used on containers
- Sections use `wpr-particle-no`, `wpr-jarallax-no`, `wpr-parallax-no`, `wpr-sticky-section-no`, `wpr-column-slider-no`, `wpr-equal-height-no`

---

## External Embeds / Integrations

| Service | Evidence |
|---------|----------|
| Font Awesome CDN | `https://kit.fontawesome.com/1288581984.js` |
| Google Fonts | Multiple font families via googleapis.com |
| GSAP CDN | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` |
| Instagram | Referenced as @volne.kridla in testimonials |

No YouTube or Vimeo embeds detected. One `.mov` video file in media library.

---

## SEO

- **Yoast SEO** active
- `yoast_head` populated per page (meta descriptions, OG tags)
- Meta description (site): derived from site tagline
