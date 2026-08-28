-- =============================================================================
-- Volné krídla — admin panel: initial schema
-- =============================================================================
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: every statement is guarded with "if not exists" / "or replace"
-- / "on conflict do nothing".
--
-- Security model:
--   * RLS is ON for every table. Default = deny.
--   * The public (anon) role can only READ published content.
--   * All writes require the caller to be in public.admins (checked via is_admin()).
--   * publish / revert run as SECURITY DEFINER functions with an explicit
--     is_admin() guard, so the client never mutates published rows directly.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Admin allowlist
-- -----------------------------------------------------------------------------
-- One row per user who is allowed to manage content. Populated manually from
-- the SQL editor (see SETUP.md) — there is no API path to add admins.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- No policies on purpose: unreachable via PostgREST. Managed only by a superuser
-- / service_role in the dashboard.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

-- -----------------------------------------------------------------------------
-- Media library — gallery_images
-- -----------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id           uuid primary key default gen_random_uuid(),
  storage_path text        not null,               -- path inside the 'media' bucket
  alt          text        not null default '',
  width        integer,
  height       integer,
  sort_order   integer     not null default 0,
  published    boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists gallery_images_sort_idx
  on public.gallery_images (sort_order, created_at);

alter table public.gallery_images enable row level security;

drop policy if exists "gallery: public reads published" on public.gallery_images;
create policy "gallery: public reads published"
  on public.gallery_images for select
  to anon, authenticated
  using (published or public.is_admin());

drop policy if exists "gallery: admin inserts" on public.gallery_images;
create policy "gallery: admin inserts"
  on public.gallery_images for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "gallery: admin updates" on public.gallery_images;
create policy "gallery: admin updates"
  on public.gallery_images for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "gallery: admin deletes" on public.gallery_images;
create policy "gallery: admin deletes"
  on public.gallery_images for delete
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- Site content — one JSON document, published + draft copies
-- -----------------------------------------------------------------------------
-- The whole editable surface of the site lives in a single JSONB document:
-- section texts, ordering, which gallery_images ids appear in the hero
-- carousel, etc. One row = one full snapshot, which makes versioning and
-- revert trivial.

create table if not exists public.site_content (
  id         integer primary key default 1,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

alter table public.site_content enable row level security;

drop policy if exists "content: everyone reads" on public.site_content;
create policy "content: everyone reads"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Direct writes are blocked for everyone; published content only changes
-- through publish_site_content(). (No insert/update/delete policy = deny.)

create table if not exists public.site_content_draft (
  id         integer primary key default 1,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id),
  constraint site_content_draft_singleton check (id = 1)
);

alter table public.site_content_draft enable row level security;

drop policy if exists "draft: admin reads" on public.site_content_draft;
create policy "draft: admin reads"
  on public.site_content_draft for select
  to authenticated
  using (public.is_admin());

drop policy if exists "draft: admin writes" on public.site_content_draft;
create policy "draft: admin writes"
  on public.site_content_draft for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Version history
-- -----------------------------------------------------------------------------
create table if not exists public.site_content_versions (
  id           uuid primary key default gen_random_uuid(),
  snapshot     jsonb       not null,
  note         text,
  created_at   timestamptz not null default now(),
  created_by   uuid references auth.users (id),
  is_published boolean     not null default false
);

create index if not exists site_content_versions_created_idx
  on public.site_content_versions (created_at desc);

alter table public.site_content_versions enable row level security;

drop policy if exists "versions: admin reads" on public.site_content_versions;
create policy "versions: admin reads"
  on public.site_content_versions for select
  to authenticated
  using (public.is_admin());

-- Rows are only ever written by the SECURITY DEFINER functions below.

-- -----------------------------------------------------------------------------
-- publish: copy draft -> published, snapshot a version
-- -----------------------------------------------------------------------------
create or replace function public.publish_site_content(p_note text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_data jsonb;
  v_id   uuid;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select data into v_data from public.site_content_draft where id = 1;
  if v_data is null then
    raise exception 'no draft to publish';
  end if;

  insert into public.site_content (id, data, updated_at)
  values (1, v_data, now())
  on conflict (id) do update set data = excluded.data, updated_at = now();

  update public.site_content_versions set is_published = false where is_published;

  insert into public.site_content_versions (snapshot, note, created_by, is_published)
  values (v_data, p_note, auth.uid(), true)
  returning id into v_id;

  return v_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- revert: load an old version back into the draft (does not auto-publish)
-- -----------------------------------------------------------------------------
create or replace function public.revert_site_content(p_version uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_data jsonb;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select snapshot into v_data
  from public.site_content_versions
  where id = p_version;

  if v_data is null then
    raise exception 'version not found';
  end if;

  insert into public.site_content_draft (id, data, updated_at, updated_by)
  values (1, v_data, now(), auth.uid())
  on conflict (id) do update
    set data = excluded.data, updated_at = now(), updated_by = auth.uid();
end;
$$;

-- -----------------------------------------------------------------------------
-- Storage bucket for uploaded media
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media: public read" on storage.objects;
create policy "media: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media: admin upload" on storage.objects;
create policy "media: admin upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admin update" on storage.objects;
create policy "media: admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media: admin delete" on storage.objects;
create policy "media: admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- -----------------------------------------------------------------------------
-- Seed the singleton rows so the app can always read them
-- -----------------------------------------------------------------------------
insert into public.site_content (id, data) values (1, '{}'::jsonb)
  on conflict (id) do nothing;
insert into public.site_content_draft (id, data) values (1, '{}'::jsonb)
  on conflict (id) do nothing;
