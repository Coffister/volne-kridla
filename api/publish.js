// Vercel serverless function: trigger a production rebuild.
//
// The admin panel calls this after editing content. We keep the Vercel Deploy
// Hook URL server-side (env var, never in the browser bundle) and only fire it
// for a verified admin.
//
// Required Vercel env vars:
//   VERCEL_DEPLOY_HOOK_URL   — Settings → Git → Deploy Hooks
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY  (already set for the frontend)

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  const url = process.env.VITE_SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_ANON_KEY;
  if (!hook || !url || !anon) {
    return res.status(500).json({ error: "not_configured" });
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "missing_token" });

  const supabase = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return res.status(401).json({ error: "invalid_token" });

  const { data: isAdmin, error: adminErr } = await supabase.rpc("is_admin");
  if (adminErr || isAdmin !== true) {
    return res.status(403).json({ error: "forbidden" });
  }

  const hookRes = await fetch(hook, { method: "POST" });
  if (!hookRes.ok) {
    return res.status(502).json({ error: "deploy_hook_failed" });
  }

  return res.status(200).json({ ok: true });
}
