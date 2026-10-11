import { useEffect, useRef, useState } from "react";

import { CONTENT_CHANGE_EVENT } from "@/lib/supabase";
import { onToast, showToast, type Toast } from "../lib/toast";

const AUTO_HIDE_MS: Record<Toast["kind"], number | null> = {
  info: 4000,
  success: 6000,
  error: null, // errors stay until dismissed
};

const SAVED_TEXT = "Uložené. Na webe sa zmena zobrazí až po publikovaní.";

// Alerts pinned to the top of the admin. Shows a "saved, publish to go live"
// note after every content change, plus publish results.
export default function Toasts() {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(
    () =>
      onToast((next) => {
        window.clearTimeout(timer.current);
        setToast(next);
        const ms = AUTO_HIDE_MS[next.kind];
        if (ms) timer.current = window.setTimeout(() => setToast(null), ms);
      }),
    [],
  );

  // A burst of writes (reordering, a multi-photo upload) would otherwise
  // re-announce many times; the same text just stays up a bit longer.
  useEffect(() => {
    const onChange = () => showToast("info", SAVED_TEXT);
    window.addEventListener(CONTENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONTENT_CHANGE_EVENT, onChange);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!toast) return null;
  return (
    <div className="admin-toasts" role="status" aria-live="polite">
      <div key={toast.id} className={`admin-toast is-${toast.kind}`}>
        <span>{toast.text}</span>
        <button type="button" aria-label="Zavrieť" onClick={() => setToast(null)}>
          ×
        </button>
      </div>
    </div>
  );
}
