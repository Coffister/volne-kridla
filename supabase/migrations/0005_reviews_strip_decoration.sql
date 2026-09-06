-- =============================================================================
-- Volné krídla — strip manually-typed "@" / quote decoration from reviews
-- =============================================================================
-- Run once, after deploying the admin form change that moves the "@" prefix
-- and the opening/closing quote marks out of the stored text and into
-- decorative UI chrome around the inputs (and into the public ReviewCard
-- render). Existing rows were entered through the old form, where Franka
-- typed "@Meno" and "„text”" by hand — without this cleanup those would be
-- shown doubled up (e.g. "@@Meno", "„„text”"") once the decoration is added
-- at render time instead.
--
-- Safe to run more than once: rows with nothing to strip are left unchanged.
-- =============================================================================

update public.reviews
set author = regexp_replace(trim(author), '^@+\s*', '')
where author ~ '^\s*@';

update public.reviews
set body = regexp_replace(
  regexp_replace(trim(body), '^["“”„]+\s*', ''),
  '\s*["“”„]+$',
  ''
)
where body ~ '^\s*["“”„]' or body ~ '["“”„]\s*$';
