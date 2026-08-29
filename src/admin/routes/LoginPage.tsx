import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { getSupabase } from "@/lib/supabase";
import { useAuth } from "../auth/AuthProvider";

export default function LoginPage() {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session && isAdmin) {
    const to =
      (location.state as { from?: { pathname: string } } | null)?.from
        ?.pathname ?? "/admin";
    return <Navigate to={to} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) setError("Nesprávny e-mail alebo heslo.");
  }

  return (
    <div className="admin-login">
      <form className="admin-card" onSubmit={onSubmit}>
        <h1>Voľné krídla — správa obsahu</h1>

        <label>
          E-mail
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Heslo
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" className="admin-btn" disabled={busy}>
          {busy ? "Prihlasujem…" : "Prihlásiť sa"}
        </button>
      </form>
    </div>
  );
}
