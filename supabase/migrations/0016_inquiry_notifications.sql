-- =============================================================================
-- Volné krídla — notification emails are built from the database, not the browser
-- =============================================================================
-- send-inquiry-email used to e-mail whatever JSON the browser POSTed, so with
-- the public anon key anyone could send branded mail from info@volnekridla.sk
-- to any address without a row ever existing. Now the function ignores the
-- request body: it claims rows with notified_at is null (atomically, so each
-- row is mailed at most once) and builds the mails from them. To get a mail
-- out you must insert a row, and inserts are rate-limited below.
--
-- Applied to production in parts (the Supabase tooling times out on bigger
-- batches) as 0016a_columns … 0016g_product_guard_trigger — same content.

alter table public.product_inquiries      add column if not exists notified_at timestamptz;
alter table public.consultation_inquiries add column if not exists notified_at timestamptz;
alter table public.presentation_inquiries add column if not exists notified_at timestamptz;

-- everything already in the tables was mailed by the old flow
update public.product_inquiries      set notified_at = created_at where notified_at is null;
update public.consultation_inquiries set notified_at = created_at where notified_at is null;
update public.presentation_inquiries set notified_at = created_at where notified_at is null;

-- the next-steps mail is keyed by type/package id and the summary shows the
-- price; these used to travel only in the email payload
alter table public.consultation_inquiries
  add column if not exists type_id       text not null default '',
  add column if not exists package_id    text not null default '',
  add column if not exists package_price text not null default '';

alter table public.consultation_inquiries
  add constraint consultation_inquiries_ids_valid check (
    length(type_id) <= 50 and length(package_id) <= 50 and length(package_price) <= 50
  );

-- server-owned columns + rate limits, same pattern as presentation_inquiries_guard
-- (0014). Consultations also mail the visitor, so their per-address limit is
-- per day, not per 10 minutes.
create or replace function public.consultation_inquiries_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.id := gen_random_uuid();
  new.handled := false;
  new.created_at := now();
  new.notified_at := null;

  if (select count(*) from public.consultation_inquiries
        where lower(email) = lower(new.email)
          and created_at > now() - interval '1 day') >= 3
     or (select count(*) from public.consultation_inquiries
        where created_at > now() - interval '1 hour') >= 20 then
    raise exception 'too many requests' using errcode = 'P0429';
  end if;

  return new;
end;
$$;

drop trigger if exists consultation_inquiries_guard on public.consultation_inquiries;
create trigger consultation_inquiries_guard
  before insert on public.consultation_inquiries
  for each row execute function public.consultation_inquiries_guard();

create or replace function public.product_inquiries_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.id := gen_random_uuid();
  new.handled := false;
  new.created_at := now();
  new.notified_at := null;

  if (select count(*) from public.product_inquiries
        where lower(email) = lower(new.email)
          and created_at > now() - interval '10 minutes') >= 3
     or (select count(*) from public.product_inquiries
        where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'too many requests' using errcode = 'P0429';
  end if;

  return new;
end;
$$;

drop trigger if exists product_inquiries_guard on public.product_inquiries;
create trigger product_inquiries_guard
  before insert on public.product_inquiries
  for each row execute function public.product_inquiries_guard();

-- presentation guard (0014) gains the notified_at reset
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
  new.notified_at := null;

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

revoke execute on function public.consultation_inquiries_guard() from public, anon, authenticated;
revoke execute on function public.product_inquiries_guard() from public, anon, authenticated;
revoke execute on function public.presentation_inquiries_guard() from public, anon, authenticated;
