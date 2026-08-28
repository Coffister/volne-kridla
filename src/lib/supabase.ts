import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The public site works fully without Supabase (content is baked in at build
// time). Supabase is only needed for the /admin panel, so a missing config
// must not break `npm run dev` or the production build.

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  client = createClient(url!, anonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "vk-admin-auth",
    },
  });
}

/** Throws if used before env vars are set — only reachable from /admin code. */
export function getSupabase(): SupabaseClient {
  if (!client) {
    throw new Error(
      "Supabase nie je nakonfigurované. Nastav VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY v .env.local",
    );
  }
  return client;
}

export const supabase = client;
