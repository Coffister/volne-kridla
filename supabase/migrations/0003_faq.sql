-- =============================================================================
-- Volné krídla — FAQ (Najčastejšie otázky / Tipy a triky)
-- =============================================================================
-- Run in the Supabase SQL Editor after 0001_init.sql and 0002_reviews.sql.
-- Same security pattern as reviews / gallery_images: public reads published
-- rows, only admins write.
--
-- `group_key` separates the two lists shown on /volne-kridla (#tipy and
-- #otazky) without needing two tables — sort_order is scoped per group.
-- =============================================================================

create table if not exists public.faq_items (
  id          uuid primary key default gen_random_uuid(),
  group_key   text        not null check (group_key in ('tipy', 'otazky')),
  question    text        not null,
  answer      text        not null,
  sort_order  integer     not null default 0,
  published   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists faq_items_group_sort_idx
  on public.faq_items (group_key, sort_order, created_at);

alter table public.faq_items enable row level security;

drop policy if exists "faq: public reads published" on public.faq_items;
create policy "faq: public reads published"
  on public.faq_items for select
  to anon, authenticated
  using (published or public.is_admin());

drop policy if exists "faq: admin inserts" on public.faq_items;
create policy "faq: admin inserts"
  on public.faq_items for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "faq: admin updates" on public.faq_items;
create policy "faq: admin updates"
  on public.faq_items for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "faq: admin deletes" on public.faq_items;
create policy "faq: admin deletes"
  on public.faq_items for delete
  to authenticated
  using (public.is_admin());
