-- =============================================================================
-- Volné krídla — public visibility of whole page sections
-- =============================================================================
-- Run in the Supabase SQL Editor after 0011_consultation_inquiries.sql.
-- One row per toggleable section, keyed by its anchor id on the page. Read at
-- build time by scripts/fetch-content.mjs; a missing row means hidden. Same
-- security pattern as faq_items: everyone reads, only admins write.
-- =============================================================================

create table if not exists public.site_sections (
  key         text        primary key,
  visible     boolean     not null default true,
  updated_at  timestamptz not null default now()
);

alter table public.site_sections enable row level security;

drop policy if exists "sections: everyone reads" on public.site_sections;
create policy "sections: everyone reads"
  on public.site_sections for select
  to anon, authenticated
  using (true);

drop policy if exists "sections: admin inserts" on public.site_sections;
create policy "sections: admin inserts"
  on public.site_sections for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "sections: admin updates" on public.site_sections;
create policy "sections: admin updates"
  on public.site_sections for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- "Tipy, triky a zaujímavosti" starts hidden (client request); the items in
-- faq_items stay untouched and reappear once this is switched back on.
insert into public.site_sections (key, visible) values ('tipy', false)
  on conflict (key) do nothing;
