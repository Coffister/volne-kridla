-- =============================================================================
-- Volné krídla — consultation modal inquiries
-- =============================================================================
-- KonzultaciaModal's submit only ever did a console.log — nothing was
-- persisted. Mirrors product_inquiries: public insert-only, admin-only
-- read/update/delete.

create table if not exists public.consultation_inquiries (
  id            uuid primary key default gen_random_uuid(),
  track_label   text        not null default '',  -- "Konzultácie" / "Kurz voľného lietania"
  type_label    text        not null default '',  -- "Online konzultácia" / "Osobná konzultácia" (konzultácia only)
  package_label text        not null default '',  -- chosen package title
  parrot_name   text        not null default '',
  species       text        not null default '',
  age           text        not null default '',
  topic         text        not null default '',
  details       text        not null default '',
  name          text        not null,
  email         text        not null,
  phone         text        not null default '',  -- includes the +421/+420 prefix, e.g. "+421 912345678"
  note          text        not null default '',
  consent       boolean     not null default false,
  handled       boolean     not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists consultation_inquiries_created_idx
  on public.consultation_inquiries (created_at desc);

alter table public.consultation_inquiries enable row level security;

drop policy if exists "consultation_inquiries: anyone can submit" on public.consultation_inquiries;
create policy "consultation_inquiries: anyone can submit"
  on public.consultation_inquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "consultation_inquiries: admin reads" on public.consultation_inquiries;
create policy "consultation_inquiries: admin reads"
  on public.consultation_inquiries for select
  to authenticated
  using (public.is_admin());

drop policy if exists "consultation_inquiries: admin updates" on public.consultation_inquiries;
create policy "consultation_inquiries: admin updates"
  on public.consultation_inquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "consultation_inquiries: admin deletes" on public.consultation_inquiries;
create policy "consultation_inquiries: admin deletes"
  on public.consultation_inquiries for delete
  to authenticated
  using (public.is_admin());

-- same server-side limits as 0010_inquiries_validation.sql's product_inquiries check
alter table public.consultation_inquiries
  add constraint consultation_inquiries_valid check (
    length(btrim(name)) between 1 and 200
    and email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    and length(email) <= 320
    and phone ~ '^[0-9+()[:space:]-]{0,50}$'
    and length(track_label) <= 200
    and length(type_label) <= 200
    and length(package_label) <= 200
    and length(parrot_name) <= 200
    and length(species) <= 200
    and length(age) <= 20
    and length(topic) <= 200
    and length(details) <= 4000
    and length(note) <= 2000
  );
