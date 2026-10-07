import { getSupabase } from "@/lib/supabase";

// keys match the section anchor ids on /volne-kridla (see 0012_site_sections.sql)
export type SectionKey = "tipy";

/** A missing row means hidden — same default the build uses. */
export async function getSectionVisible(key: SectionKey): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from("site_sections")
    .select("visible")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data?.visible ?? false;
}

export async function setSectionVisible(key: SectionKey, visible: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from("site_sections")
    .upsert({ key, visible, updated_at: new Date().toISOString() });
  if (error) throw error;
}
