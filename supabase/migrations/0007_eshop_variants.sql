-- =============================================================================
-- Volné krídla — e-shop variants & enhanced product data
-- =============================================================================
-- Add support for product variants (color, size), multiple images, SKU, and stock info.

-- Add new columns to products table
alter table if exists public.products
  add column if not exists sku text default '',
  add column if not exists variants jsonb default '[]'::jsonb,
  add column if not exists images jsonb default '[]'::jsonb,
  add column if not exists stock_count integer default 0,
  add column if not exists in_stock boolean default true;

-- Comment on new columns for clarity
comment on column public.products.sku is 'Product code/SKU for admin reference (e.g. "Kód 444")';
comment on column public.products.variants is 'Array of variant types: [{type: "color"|"size", options: ["Red", "Blue"]}]';
comment on column public.products.images is 'Array of images for carousel: [{storage_path: "..."} or {image_url: "..."}]';
comment on column public.products.stock_count is 'Number of items in stock (0 = unknown/unlimited)';
comment on column public.products.in_stock is 'Whether the product is currently available';

-- Add variants field to product_inquiries to store selected variant choices
alter table if exists public.product_inquiries
  add column if not exists variants jsonb default '{}'::jsonb;

comment on column public.product_inquiries.variants is 'Selected variants: {color: "Red", size: "L"}';
