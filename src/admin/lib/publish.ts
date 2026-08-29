import { getSupabase } from "@/lib/supabase";

/**
 * Ask the /api/publish serverless function to fire the Vercel Deploy Hook.
 * Resolves when the rebuild has been queued (not when it finishes).
 */
export async function requestPublish(): Promise<void> {
  const { data } = await getSupabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Nie si prihlásený.");

  const res = await fetch("/api/publish", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = (await res.json().catch(() => null)) as
    | { ok?: boolean; error?: string }
    | null;

  if (!res.ok || !body?.ok) {
    const map: Record<string, string> = {
      not_configured: "Chýba nastavenie Deploy Hooku na Verceli.",
      forbidden: "Tento účet nemá oprávnenie publikovať.",
      deploy_hook_failed: "Vercel odmietol požiadavku na build.",
    };
    throw new Error(
      (body?.error && map[body.error]) ||
        "Publikovanie zlyhalo. (Funguje len na nasadenom webe, nie v lokálnom deve.)",
    );
  }
}
