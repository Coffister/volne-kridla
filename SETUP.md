# Admin panel — nastavenie

Web funguje aj bez týchto krokov (obsah je „zapečený" v builde). Supabase je
potrebné len pre `/admin`.

## 1. Supabase projekt

1. [supabase.com](https://supabase.com) → **New project**, región **Frankfurt (eu-central-1)**.
2. Po vytvorení: **Settings → API**, odlož si:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon` `public` kľúč → `VITE_SUPABASE_ANON_KEY`
   - `service_role` `secret` kľúč → `SUPABASE_SERVICE_ROLE_KEY` (len pre build, nikdy do prehliadača)

## 2. Databázová schéma

**SQL Editor → New query** → vlož obsah `supabase/migrations/0001_init.sql` → **Run**.
Vytvorí tabuľky, RLS politiky, `publish`/`revert` funkcie a storage bucket `media`.

## 3. Účet majiteľky

1. **Authentication → Providers → Email**: vypni *„Allow new users to sign up"*.
2. **Authentication → Users → Add user → Create new user**: zadaj e-mail + heslo,
   zaškrtni *Auto Confirm User*.
3. Skopíruj `User UID` (v detaile používateľa).
4. **SQL Editor**, spusti (nahraď UID):
   ```sql
   insert into public.admins (user_id) values ('SEM-VLOZ-USER-UID');
   ```

## 4. Lokálny vývoj

```bash
cp .env.example .env.local
# vyplň VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

Admin: `http://localhost:5173/admin`

## 5. Vercel

1. **Add New → Project** → import `Coffister/volne-kridla`.
2. Framework preset: **Vite**. Build: `npm run build`, Output: `dist`.
3. **Settings → Environment Variables** (Production + Preview):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. **Settings → Git → Deploy Hooks**: vytvor hook „publish" pre vetvu `main`,
   URL odlož ako `VERCEL_DEPLOY_HOOK_URL` (použije sa vo Fáze 2/3 pri publikovaní).
5. SPA routing (`/admin` refresh nesmie hodiť 404): pridá sa `vercel.json`
   s rewrite `/(.*) → /index.html` (doplní sa pri napojení Vercelu).

## Ako to celé funguje

- **Build:** `npm run build` najprv spustí `scripts/fetch-content.mjs`, ktorý stiahne
  publikovaný obsah zo Supabase do `src/content/site.generated.json`. Ak chýbajú
  premenné, použije sa commitnutý `src/content/site.json` a build nespadne.
- **Verejný web** číta iba tento JSON — žiadne volania Supabase za behu, žiadny
  `@supabase/supabase-js` v hlavnom bundli (overené: je len v lazy `/admin` chunku).
- **Admin** píše do `site_content_draft`; „Publikovať" skopíruje draft do
  `site_content`, uloží verziu a pingne Vercel Deploy Hook → rebuild.
- **Revert** načíta staršiu verziu späť do draftu.
