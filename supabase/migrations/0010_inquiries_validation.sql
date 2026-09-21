-- Server-side limits for the public "mám záujem" form. The browser validates
-- too, but anon inserts go straight to Postgres, so enforce the basics here.
-- NOT VALID: applies to new rows only, existing rows are left untouched.
alter table public.product_inquiries
  add constraint product_inquiries_valid check (
    length(btrim(name)) between 1 and 200
    and email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    and length(email) <= 320
    and phone ~ '^[0-9+()[:space:]-]{0,50}$'
    and jsonb_typeof(variants) = 'object'
    and length(variants::text) <= 2000
    and length(message) <= 2000
  ) not valid;
