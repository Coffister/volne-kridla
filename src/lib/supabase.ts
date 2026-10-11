import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The public site works fully without Supabase (content is baked in at build
// time). Supabase is only needed for the /admin panel, so a missing config
// must not break `npm run dev` or the production build.

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/** Window event fired after a successful write to site content (see below). */
export const CONTENT_CHANGE_EVENT = "vk:content-change";

// Inquiries are customer requests, not website content — editing them never
// needs a publish, so they don't announce a change.
const NON_CONTENT_TABLES = new Set(["product_inquiries", "consultation_inquiries"]);

// Wraps fetch to fire CONTENT_CHANGE_EVENT after any successful insert /
// update / delete on a content table. The admin listens for it to remind
// that changes go live only after "Publikovať zmeny" — one place instead of
// a call in every form. RPCs (is_admin, publish…) and storage uploads (always
// followed by a row insert) don't count. Nothing listens on the public site.
const announcingFetch: typeof fetch = async (input, init) => {
  const res = await fetch(input, init);
  const method = (init?.method ?? "GET").toUpperCase();
  if (res.ok && method !== "GET" && method !== "HEAD") {
    const path = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url).pathname;
    const table = path.match(/^\/rest\/v1\/([^/]+)$/)?.[1];
    if (table && table !== "rpc" && !NON_CONTENT_TABLES.has(table)) {
      window.dispatchEvent(new CustomEvent(CONTENT_CHANGE_EVENT));
    }
  }
  return res;
};

if (isSupabaseConfigured) {
  client = createClient(url!, anonKey!, {
    global: { fetch: announcingFetch },
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
