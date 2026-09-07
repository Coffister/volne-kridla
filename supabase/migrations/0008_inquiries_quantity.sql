-- =============================================================================
-- Volné krídla — quantity on product inquiries
-- =============================================================================
-- Cart checkout submits one inquiry row per cart line; quantity records how
-- many units of that variant combination were requested.

alter table if exists public.product_inquiries
  add column if not exists quantity integer not null default 1;

comment on column public.product_inquiries.quantity is 'Number of units requested for this line';
