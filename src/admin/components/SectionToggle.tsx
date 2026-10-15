import { useEffect, useState } from "react";

import { getSectionVisible, setSectionVisible, type SectionKey } from "../lib/sections";
import { msg } from "../lib/errors";

interface Props {
  sectionKey: SectionKey;
  /** what is being shown/hidden, e.g. "sekciu" or "osobnú konzultáciu" */
  noun?: string;
  shownText?: string;
  hiddenText?: string;
}

/** Show/hide a whole section (or offer) on the public site — applied on publish. */
export default function SectionToggle({
  sectionKey,
  noun = "sekciu",
  shownText = "Sekcia je na webe zobrazená.",
  hiddenText = "Sekcia je na webe skrytá (aj v menu).",
}: Props) {
  const [visible, setVisible] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSectionVisible(sectionKey)
      .then(setVisible)
      .catch((e) => setError(msg(e)));
  }, [sectionKey]);

  async function toggle() {
    if (visible === null) return;
    const next = !visible;
    setVisible(next);
    setError(null);
    try {
      await setSectionVisible(sectionKey, next);
    } catch (e) {
      setVisible(!next);
      setError(msg(e));
    }
  }

  return (
    <div>
      <p className="admin-muted">
        {visible === null ? "Načítavam…" : visible ? shownText : hiddenText}
      </p>
      <button
        type="button"
        className="admin-btn admin-btn-sm"
        onClick={toggle}
        disabled={visible === null}
      >
        {visible ? `Skryť ${noun}` : `Zobraziť ${noun}`}
      </button>
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}
