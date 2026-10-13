-- =============================================================================
-- Volné krídla — reviews: adjustable photo framing
-- =============================================================================
-- Run in the Supabase SQL Editor after 0014.
-- The review card shows the photo with object-fit: cover in two very different
-- frames (tall portrait on desktop, square on mobile), so a fixed crop
-- can't fit both. Instead the admin stores a focal point — the CSS
-- object-position, in percent — and both frames centre on it as best they can.
-- Defaults (50 / 0 = "center top") match the previous hardcoded styling, so
-- existing reviews look exactly as before until someone adjusts them.
-- =============================================================================

alter table public.reviews
  add column if not exists image_pos_x real not null default 50
    check (image_pos_x between 0 and 100),
  add column if not exists image_pos_y real not null default 0
    check (image_pos_y between 0 and 100);
