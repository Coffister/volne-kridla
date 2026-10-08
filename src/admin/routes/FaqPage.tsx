import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  createFaqItem,
  deleteFaqItem,
  listFaqItems,
  reorderFaqItems,
  updateFaqItem,
  type FaqGroup,
  type FaqRow,
} from "../lib/faq";
import { getSectionVisible, setSectionVisible, type SectionKey } from "../lib/sections";
import { msg } from "../lib/errors";

/** Show/hide the whole section on the public page (not just single items). */
function SectionToggle({ sectionKey }: { sectionKey: SectionKey }) {
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
        {visible === null
          ? "Načítavam…"
          : visible
            ? "Sekcia je na webe zobrazená."
            : "Sekcia je na webe skrytá (aj v menu)."}
      </p>
      <button
        type="button"
        className="admin-btn admin-btn-sm"
        onClick={toggle}
        disabled={visible === null}
      >
        {visible ? "Skryť sekciu" : "Zobraziť sekciu"}
      </button>
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}

interface FaqGroupSectionProps {
  group: FaqGroup;
  title: string;
  /** when set, the whole section can be hidden from the public page */
  sectionKey?: SectionKey;
}

function FaqGroupSection({ group, title, sectionKey }: FaqGroupSectionProps) {
  const [items, setItems] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [adding, setAdding] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listFaqItems(group));
      setError(null);
    } catch (e) {
      setError(msg(e));
    } finally {
      setLoading(false);
    }
  }, [group]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setAdding(true);
    setError(null);
    try {
      await createFaqItem({ group, question, answer });
      setQuestion("");
      setAnswer("");
      await refresh();
    } catch (e) {
      setError(msg(e));
    } finally {
      setAdding(false);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const t = index + dir;
    if (t < 0 || t >= next.length) return;
    [next[index], next[t]] = [next[t], next[index]];
    setItems(next);
    try {
      await reorderFaqItems(next);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function patch(
    item: FaqRow,
    p: Partial<Pick<FaqRow, "question" | "answer" | "published">>,
  ) {
    setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, ...p } : i)));
    try {
      await updateFaqItem(item.id, p);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onDelete(item: FaqRow) {
    if (!confirm(`Zmazať otázku „${item.question}"? Nedá sa vrátiť.`)) return;
    setItems((cur) => cur.filter((i) => i.id !== item.id));
    try {
      await deleteFaqItem(item.id);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page-head">
        <div>
          <h2>{title}</h2>
          <p className="admin-muted">
            {loading ? "Načítavam…" : `${items.length} otázok`}
          </p>
        </div>
        {sectionKey && <SectionToggle sectionKey={sectionKey} />}
      </header>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-review-form" onSubmit={onAdd}>
        <h3>Pridať otázku</h3>
        <input
          type="text"
          placeholder="Otázka"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <textarea
          placeholder="Odpoveď"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
        <button type="submit" className="admin-btn" disabled={adding}>
          {adding ? "Pridávam…" : "Pridať"}
        </button>
      </form>

      <ul className="admin-review-list is-textonly">
        {items.map((item, i) => (
          <li key={item.id} className={item.published ? "" : "is-hidden"}>
            <div className="admin-review-body">
              <input
                type="text"
                defaultValue={item.question}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== item.question) patch(item, { question: v });
                }}
              />
              <textarea
                defaultValue={item.answer}
                rows={4}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== item.answer) patch(item, { answer: v });
                }}
              />
              <div className="admin-gallery-actions">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => patch(item, { published: !item.published })}
                >
                  {item.published ? "Skryť" : "Zobraziť"}
                </button>
                <button
                  type="button"
                  className="is-danger"
                  onClick={() => onDelete(item)}
                >
                  Zmazať
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {!loading && items.length === 0 && (
        <p className="admin-muted">Zatiaľ žiadne otázky.</p>
      )}
    </section>
  );
}

export default function FaqPage() {
  return (
    <>
      <FaqGroupSection group="tipy" title="Tipy, triky a zaujímavosti" sectionKey="tipy" />
      <FaqGroupSection group="otazky" title="Najčastejšie otázky" />
    </>
  );
}
