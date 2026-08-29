-- =============================================================================
-- Volné krídla — reviews (recenzie klientov)
-- =============================================================================
-- Run in the Supabase SQL Editor after 0001_init.sql.
-- Same security pattern as gallery_images: public reads published rows,
-- only admins write.
-- =============================================================================

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  author      text        not null,               -- meno klienta, napr. "@Natália a Arny"
  body        text        not null,               -- text recenzie
  image_path  text,                               -- ak je fotka v bucketе 'media'
  image_url   text,                               -- alebo externá URL (staré recenzie)
  sort_order  integer     not null default 0,
  published   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists reviews_sort_idx
  on public.reviews (sort_order, created_at);

alter table public.reviews enable row level security;

drop policy if exists "reviews: public reads published" on public.reviews;
create policy "reviews: public reads published"
  on public.reviews for select
  to anon, authenticated
  using (published or public.is_admin());

drop policy if exists "reviews: admin inserts" on public.reviews;
create policy "reviews: admin inserts"
  on public.reviews for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "reviews: admin updates" on public.reviews;
create policy "reviews: admin updates"
  on public.reviews for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "reviews: admin deletes" on public.reviews;
create policy "reviews: admin deletes"
  on public.reviews for delete
  to authenticated
  using (public.is_admin());
