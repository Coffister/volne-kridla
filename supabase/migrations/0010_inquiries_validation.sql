-- Server-side limits for the public "mám záujem" form. The browser validates
-- too, but anon inserts go straight to Postgres, so enforce the basics here.
-- NOT VALID: applies to new rows only, existing rows are left untouched.
alter table public.product_inquiries
  add constraint product_inquiries_valid check (
    length(btrim(name)) between 1 and 200
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and length(email) <= 320
    and length(phone) <= 50
    and length(message) <= 2000
  ) not valid;
