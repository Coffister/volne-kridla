import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  createReview,
  deleteReview,
  listReviews,
  reorderReviews,
  updateReview,
  type ReviewItem,
} from "../lib/reviews";

function msg(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) return String(e.message);
  return "Nastala chyba.";
}

export default function ReviewsPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listReviews());
      setError(null);
    } catch (e) {
      setError(msg(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!author.trim() || !body.trim()) return;
    setAdding(true);
    setError(null);
    try {
      await createReview({ author, body, imageFile, imageUrl });
      setAuthor("");
      setBody("");
      setImageFile(null);
      setImageUrl("");
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
      await reorderReviews(next);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function patch(
    item: ReviewItem,
    p: Partial<Pick<ReviewItem, "author" | "body" | "published">>,
  ) {
    setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, ...p } : i)));
    try {
      await updateReview(item.id, p);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onDelete(item: ReviewItem) {
    if (!confirm(`Zmazať recenziu od „${item.author}"? Nedá sa vrátiť.`)) return;
    setItems((cur) => cur.filter((i) => i.id !== item.id));
    try {
      await deleteReview(item);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page-head">
        <div>
          <h2>Recenzie</h2>
          <p className="admin-muted">
            {loading ? "Načítavam…" : `${items.length} recenzií`}
          </p>
        </div>
      </header>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-review-form" onSubmit={onAdd}>
        <h3>Pridať recenziu</h3>
        <input
          type="text"
          placeholder="Meno klienta (napr. @Natália a Arny)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <textarea
          placeholder="Text recenzie"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <div className="admin-review-image-inputs">
          <label className="admin-btn admin-btn-sm">
            {imageFile ? imageFile.name : "Nahrať fotku"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <span className="admin-muted">alebo</span>
          <input
            type="url"
            placeholder="URL fotky"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={!!imageFile}
          />
        </div>
        <button type="submit" className="admin-btn" disabled={adding}>
          {adding ? "Pridávam…" : "Pridať"}
        </button>
      </form>

      <ul className="admin-review-list">
        {items.map((item, i) => (
          <li key={item.id} className={item.published ? "" : "is-hidden"}>
            {item.image ? (
              <img src={item.image} alt={item.author} loading="lazy" />
            ) : (
              <div className="admin-review-noimg">bez fotky</div>
            )}
            <div className="admin-review-body">
              <input
                type="text"
                defaultValue={item.author}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== item.author) patch(item, { author: v });
                }}
              />
              <textarea
                defaultValue={item.body}
                rows={4}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== item.body) patch(item, { body: v });
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
        <p className="admin-muted">Zatiaľ žiadne recenzie.</p>
      )}
    </section>
  );
}
