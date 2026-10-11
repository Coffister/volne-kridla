import { useState } from "react";

import { requestPublish } from "../lib/publish";
import { showToast } from "../lib/toast";

export default function PublishButton() {
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await requestPublish();
      showToast("success", "Spustené — web sa prebuduje o ~1–2 min.");
    } catch (e) {
      showToast(
        "error",
        e instanceof Error ? e.message : "Publikovanie zlyhalo.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className="admin-btn admin-publish"
      onClick={onClick}
      disabled={busy}
    >
      {busy ? "Spúšťam…" : "Publikovať zmeny"}
    </button>
  );
}
