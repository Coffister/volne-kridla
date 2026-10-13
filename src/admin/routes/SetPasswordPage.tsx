import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { getSupabase } from "@/lib/supabase";
import { useAuth } from "../auth/AuthProvider";

const MIN_LENGTH = 8;

// Error Supabase puts in the hash when an invite / reset link is expired or
// already used, e.g. #error=access_denied&error_code=otp_expired&…
// index.html saves the original hash, since the Supabase client clears it
// before this lazy-loaded page runs.
declare global {
  interface Window {
    __vkAuthHash?: string;
  }
}
const LINK_ERROR = new URLSearchParams(
  (window.__vkAuthHash ?? window.location.hash).slice(1),
).get("error_code");

/**
 * Landing page for Supabase invite and password-reset links (index.html
 * routes those links here). The link itself signs the user in; this page
 * only asks for the new password and saves it.
 */
export default function SetPasswordPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < MIN_LENGTH) {
      setError(`Heslo musí mať aspoň ${MIN_LENGTH} znakov.`);
      return;
    }
    if (password !== confirm) {
      setError("Heslá sa nezhodujú.");
      return;
    }
    setBusy(true);
    const { error } = await getSupabase().auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(
        error.message.toLowerCase().includes("different")
          ? "Nové heslo musí byť iné ako to doterajšie."
          : "Heslo sa nepodarilo uložiť. Skús to znova.",
      );
      return;
    }
    navigate("/admin", { replace: true });
  }

  let body;
  if (loading) {
    body = <p>Overujem odkaz…</p>;
  } else if (!session) {
    body = (
      <>
        <p>
          {LINK_ERROR
            ? "Tento odkaz už vypršal alebo bol použitý. Požiadaj o nový e-mail s pozvánkou."
            : "Na túto stránku sa dostaneš cez odkaz z e-mailu s pozvánkou alebo obnovením hesla."}
        </p>
        <a href="/admin/login" className="admin-btn">
          Na prihlásenie
        </a>
      </>
    );
  } else {
    body = (
      <>
        <p>
          Účet <strong>{session.user.email}</strong>. Zvoľ si heslo, ktorým sa
          budeš do správy obsahu prihlasovať.
        </p>

        <label>
          Nové heslo
          <input
            type="password"
            autoComplete="new-password"
            minLength={MIN_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Zopakuj heslo
          <input
            type="password"
            autoComplete="new-password"
            minLength={MIN_LENGTH}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" className="admin-btn" disabled={busy}>
          {busy ? "Ukladám…" : "Uložiť heslo"}
        </button>
      </>
    );
  }

  return (
    <div className="admin-login">
      <form className="admin-card" onSubmit={onSubmit}>
        <h1>Nastav si heslo</h1>
        {body}
      </form>
    </div>
  );
}
