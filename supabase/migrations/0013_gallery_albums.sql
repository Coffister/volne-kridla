-- =============================================================================
-- Volné krídla — gallery albums ("priečinky")
-- =============================================================================
-- Groups gallery photos into albums, typically one per event. A photo belongs
-- to at most one album; album_id = null means "nezaradené" (shown loose on the
-- public /fotogaleria page, below the albums).
--
-- gallery_images also backs the hero carousel (site_content.heroCarousel holds
-- gallery_images ids), so deleting an album must never delete its photos —
-- they just fall back to "nezaradené" (on delete set null).
--
-- Purely additive: safe to apply before the app code that uses it is deployed.

create table if not exists public.gallery_albums (
  id             uuid primary key default gen_random_uuid(),
  slug           text        not null unique,     -- URL: /fotogaleria/<slug>
  title          text        not null default '',
  description    text        not null default '',
  event_date     date,                             -- shown on the card, sorts albums
  cover_image_id uuid,                             -- null = first photo in the album
  published      boolean     not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.gallery_images
  add column if not exists album_id uuid
    references public.gallery_albums (id) on delete set null;

-- smaller copy for grids; null on photos uploaded before this migration
alter table public.gallery_images
  add column if not exists thumb_path text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'gallery_albums_cover_fk'
  ) then
    alter table public.gallery_albums
      add constraint gallery_albums_cover_fk
      foreign key (cover_image_id) references public.gallery_images (id)
      on delete set null;
  end if;
end $$;

create index if not exists gallery_images_album_idx
  on public.gallery_images (album_id, sort_order);

alter table public.gallery_albums enable row level security;

drop policy if exists "albums: public reads published" on public.gallery_albums;
create policy "albums: public reads published"
  on public.gallery_albums for select
  to anon, authenticated
  using (published or public.is_admin());

drop policy if exists "albums: admin inserts" on public.gallery_albums;
create policy "albums: admin inserts"
  on public.gallery_albums for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "albums: admin updates" on public.gallery_albums;
create policy "albums: admin updates"
  on public.gallery_albums for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "albums: admin deletes" on public.gallery_albums;
create policy "albums: admin deletes"
  on public.gallery_albums for delete
  to authenticated
  using (public.is_admin());
