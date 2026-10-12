-- =============================================================================
-- Volné krídla — presentation booking inquiries (školy a organizácie)
-- =============================================================================
-- RezervaciaModal on /pre-skoly. Mirrors consultation_inquiries: public
-- insert-only, admin-only read/update/delete.
--
-- Applied to production in parts (one statement group per migration, the
-- Supabase tooling times out on bigger batches) as 0014a_table,
-- 0014b_policies, 0014c_check, 0014d_guard_fn, 0014e_guard_trigger and
-- 0014f_guard_not_rpc — the content is identical to this file.

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

create policy "presentation_inquiries: anyone can submit"
  on public.presentation_inquiries for insert
  to anon, authenticated
  with check (true);

create policy "presentation_inquiries: admin reads"
  on public.presentation_inquiries for select
  to authenticated
  using (public.is_admin());

create policy "presentation_inquiries: admin updates"
  on public.presentation_inquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "presentation_inquiries: admin deletes"
  on public.presentation_inquiries for delete
  to authenticated
  using (public.is_admin());

-- server-side limits: the browser validates too, but anon inserts go
-- straight to Postgres, so the database is the real gate
alter table public.presentation_inquiries
  add constraint presentation_inquiries_valid check (
    length(btrim(name)) between 1 and 200
    and email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    and length(email) <= 320
    and phone ~ '^[0-9+()[:space:]-]{0,50}$'
    and length(btrim(org_name)) between 1 and 200
    and length(btrim(city)) between 1 and 200
    and inviter_kind in ('Škola', 'Organizácia')
    and length(subtype) <= 200
    and participants ~ '^[0-9]{1,5}$'
    and length(age_group) <= 100
    and date_to >= date_from
    and date_to - date_from <= 366
    and length(note) <= 2000
    and consent
  );

-- server-owned columns: whatever a direct API call sends for id, handled
-- or created_at is overwritten, so nobody can back-date a row or mark it as
-- already handled to hide it in the admin list
--
-- dates must not be in the past (checked at insert time, so old rows stay
-- valid as time passes) — a trigger, because CHECK can't use now()
--
-- rate limit: at most 3 requests per e-mail per 10 minutes and 30 in total
-- per hour. Generous for real schools, but caps a bot that floods the table
-- (and, through the notification, the owner's inbox).
create or replace function public.presentation_inquiries_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.id := gen_random_uuid();
  new.handled := false;
  new.created_at := now();

  if new.date_from < (now() at time zone 'Europe/Bratislava')::date then
    raise exception 'date_from is in the past' using errcode = 'check_violation';
  end if;

  if (select count(*) from public.presentation_inquiries
        where lower(email) = lower(new.email)
          and created_at > now() - interval '10 minutes') >= 3
     or (select count(*) from public.presentation_inquiries
        where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'too many requests' using errcode = 'P0429';
  end if;

  return new;
end;
$$;

create trigger presentation_inquiries_guard
  before insert on public.presentation_inquiries
  for each row execute function public.presentation_inquiries_guard();

-- a trigger function has no business being an RPC endpoint (Supabase's
-- security advisor flags SECURITY DEFINER functions callable by anon);
-- triggers still fire — EXECUTE is only checked when the trigger is created
revoke execute on function public.presentation_inquiries_guard() from public, anon, authenticated;
