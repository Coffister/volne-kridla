-- =============================================================================
-- Volné krídla — product categories
-- =============================================================================
-- Adds a category tag to products so the public /eshop page can filter by
-- category (e.g. "Veci na tréning", "Veci na lietanie"). Free text, matching
-- the existing price_label convention — the known values live in
-- src/content/categories.ts on the app side.

alter table if exists public.products
  add column if not exists category text not null default '';

comment on column public.products.category is 'Product category slug (e.g. "trening", "lietanie"), empty = uncategorized';
