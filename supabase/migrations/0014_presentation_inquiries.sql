-- =============================================================================
-- Volné krídla — presentation booking inquiries (školy a organizácie)
-- =============================================================================
-- RezervaciaModal on /pre-skoly. Mirrors consultation_inquiries: public
-- insert-only, admin-only read/update/delete.

create table if not exists public.presentation_inquiries (
  id            uuid primary key default gen_random_uuid(),
  inviter_kind  text        not null default '',  -- "Škola" / "Organizácia"
  subtype       text        not null default '',  -- "Základná škola", "Domov seniorov", …
  org_name      text        not null,
  city          text        not null,
  participants  text        not null default '',  -- approximate head count, as typed
  age_group     text        not null default '',
  date_from     date        not null,              -- earliest acceptable day
  date_to       date        not null,              -- latest acceptable day (= date_from for one day)
  note          text        not null default '',
  name          text        not null,              -- contact person
  email         text        not null,
  phone         text        not null default '',   -- includes the +421/+420 prefix
  consent       boolean     not null default false,
  handled       boolean     not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists presentation_inquiries_created_idx
  on public.presentation_inquiries (created_at desc);

alter table public.presentation_inquiries enable row level security;

drop policy if exists "presentation_inquiries: anyone can submit" on public.presentation_inquiries;
create policy "presentation_inquiries: anyone can submit"
  on public.presentation_inquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "presentation_inquiries: admin reads" on public.presentation_inquiries;
create policy "presentation_inquiries: admin reads"
  on public.presentation_inquiries for select
  to authenticated
  using (public.is_admin());

drop policy if exists "presentation_inquiries: admin updates" on public.presentation_inquiries;
create policy "presentation_inquiries: admin updates"
  on public.presentation_inquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "presentation_inquiries: admin deletes" on public.presentation_inquiries;
create policy "presentation_inquiries: admin deletes"
  on public.presentation_inquiries for delete
  to authenticated
  using (public.is_admin());

-- same server-side limits as the other inquiry tables
alter table public.presentation_inquiries
  add constraint presentation_inquiries_valid check (
    length(btrim(name)) between 1 and 200
    and email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    and length(email) <= 320
    and phone ~ '^[0-9+()[:space:]-]{0,50}$'
    and length(btrim(org_name)) between 1 and 200
    and length(btrim(city)) between 1 and 200
    and length(inviter_kind) <= 50
    and length(subtype) <= 200
    and length(participants) <= 20
    and length(age_group) <= 100
    and date_to >= date_from
    and length(note) <= 2000
  );
