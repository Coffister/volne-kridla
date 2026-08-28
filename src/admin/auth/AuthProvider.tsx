import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";

import { getSupabase } from "@/lib/supabase";

interface AuthState {
  loading: boolean;
  session: Session | null;
  /** true only if the signed-in user is in the public.admins allowlist */
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabase();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function resolveAdmin(next: Session | null) {
      if (!next) {
        if (active) {
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      // is_admin() is a SECURITY DEFINER function — one round trip, no table read.
      const { data, error } = await supabase.rpc("is_admin");
      if (!active) return;
      setSession(next);
      setIsAdmin(!error && data === true);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => resolveAdmin(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setLoading(true);
      resolveAdmin(next);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      session,
      isAdmin,
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [loading, session, isAdmin, supabase],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
