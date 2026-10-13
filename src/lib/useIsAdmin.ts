import { useEffect, useState } from "react";

import { ADMIN_AUTH_STORAGE_KEY, getSupabase, isSupabaseConfigured } from "./supabase";

/**
 * True when this browser is signed in to the admin as an actual admin.
 *
 * Ordinary visitors have no stored session, so this returns false without a
 * single network request. Only when a session is stored do we ask the
 * database (is_admin()) — a stored session alone isn't proof of admin rights.
 * This only decides whether to show a shortcut; the admin itself stays
 * protected by its login and the database's row-level security.
 */
export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let hasSession = false;
    try {
      hasSession = Boolean(localStorage.getItem(ADMIN_AUTH_STORAGE_KEY));
    } catch {
      // storage blocked (private mode etc.) — treat as signed out
    }
    if (!hasSession || !isSupabaseConfigured) return;

    let active = true;
    getSupabase()
      .rpc("is_admin")
      .then(({ data, error }) => {
        if (active) setIsAdmin(!error && data === true);
      });
    return () => {
      active = false;
    };
  }, []);

  return isAdmin;
}
