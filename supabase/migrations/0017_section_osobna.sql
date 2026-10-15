-- In-person consultation can be hidden from the consultation modal (client
-- request: offer online only for now). Toggled in the admin under
-- Dopyty → Konzultácie; same table/semantics as 0012_site_sections.sql.
insert into public.site_sections (key, visible) values ('osobna', false)
  on conflict (key) do nothing;
