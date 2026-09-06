-- =============================================================================
-- Volné krídla — e-shop (produkty + dopyty)
-- =============================================================================
-- Run in the Supabase SQL Editor after 0001_init.sql.
--
-- No payment processing here on purpose — the site owner handles payment
-- herself. `product_inquiries` is just a "someone is interested" note the
-- public site writes and only the admin can read; it is NOT a real order/cart
-- system. Sending an email notification on new rows is a later step (needs an
-- email provider decision) — for now the admin panel is the only way to see
-- new inquiries.
-- =============================================================================

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  description text        not null default '',
  price_label text        not null default '',      -- free text, e.g. "25 €" or "od 20 €"
  image_path  text,                                  -- in bucket 'media'
  image_url   text,                                  -- or external URL
  sort_order  integer     not null default 0,
  published   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists products_sort_idx
  on public.products (sort_order, created_at);

alter table public.products enable row level security;

drop policy if exists "products: public reads published" on public.products;
create policy "products: public reads published"
  on public.products for select
  to anon, authenticated
  using (published or public.is_admin());

drop policy if exists "products: admin inserts" on public.products;
create policy "products: admin inserts"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "products: admin updates" on public.products;
create policy "products: admin updates"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products: admin deletes" on public.products;
create policy "products: admin deletes"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- product_inquiries — "mám záujem" submissions from the public /eshop page.
-- The public can only INSERT (never read back other people's inquiries);
-- only the admin can list/update/delete them.
-- -----------------------------------------------------------------------------

create table if not exists public.product_inquiries (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid references public.products(id) on delete set null,
  product_name text        not null,  -- snapshot — survives the product being edited/deleted later
  name         text        not null,
  email        text        not null,
  phone        text        not null default '',
  message      text        not null default '',
  handled      boolean     not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists product_inquiries_created_idx
  on public.product_inquiries (created_at desc);

alter table public.product_inquiries enable row level security;

drop policy if exists "inquiries: anyone can submit" on public.product_inquiries;
create policy "inquiries: anyone can submit"
  on public.product_inquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "inquiries: admin reads" on public.product_inquiries;
create policy "inquiries: admin reads"
  on public.product_inquiries for select
  to authenticated
  using (public.is_admin());

drop policy if exists "inquiries: admin updates" on public.product_inquiries;
create policy "inquiries: admin updates"
  on public.product_inquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "inquiries: admin deletes" on public.product_inquiries;
create policy "inquiries: admin deletes"
  on public.product_inquiries for delete
  to authenticated
  using (public.is_admin());
