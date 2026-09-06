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

function msg(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) return String(e.message);
  return "Nastala chyba.";
}

interface FaqGroupSectionProps {
  group: FaqGroup;
  title: string;
}

function FaqGroupSection({ group, title }: FaqGroupSectionProps) {
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
      <FaqGroupSection group="tipy" title="Tipy, triky a zaujímavosti" />
      <FaqGroupSection group="otazky" title="Najčastejšie otázky" />
    </>
  );
}
