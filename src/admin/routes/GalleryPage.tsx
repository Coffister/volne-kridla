import { useCallback, useEffect, useRef, useState } from "react";

import {
  deleteImage,
  listGallery,
  reorder,
  updateImage,
  uploadImage,
  type GalleryItem,
} from "../lib/gallery";
import { msg } from "../lib/errors";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listGallery());
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

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        await uploadImage(file, "");
      }
      await refresh();
    } catch (e) {
      setError(msg(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next); // optimistic
    try {
      await reorder(next);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onAltBlur(item: GalleryItem, value: string) {
    if (value === item.alt) return;
    setItems((cur) =>
      cur.map((i) => (i.id === item.id ? { ...i, alt: value } : i)),
    );
    try {
      await updateImage(item.id, { alt: value });
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onToggle(item: GalleryItem) {
    const published = !item.published;
    setItems((cur) =>
      cur.map((i) => (i.id === item.id ? { ...i, published } : i)),
    );
    try {
      await updateImage(item.id, { published });
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onDelete(item: GalleryItem) {
    if (!confirm("Naozaj zmazať túto fotku? Nedá sa vrátiť späť.")) return;
    setItems((cur) => cur.filter((i) => i.id !== item.id));
    try {
      await deleteImage(item);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page-head">
        <div>
          <h2>Fotogaléria</h2>
          <p className="admin-muted">
            {loading ? "Načítavam…" : `${items.length} fotiek`}
          </p>
        </div>
        <label className="admin-btn">
          {busy ? "Nahrávam…" : "Pridať fotky"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={busy}
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
      </header>

      {error && <p className="admin-error">{error}</p>}

      <ul className="admin-gallery">
        {items.map((item, i) => (
          <li key={item.id} className={item.published ? "" : "is-hidden"}>
            <img src={item.url} alt={item.alt} loading="lazy" />
            <div className="admin-gallery-body">
              <input
                type="text"
                defaultValue={item.alt}
                placeholder="Popis fotky (alt text)"
                onBlur={(e) => onAltBlur(item, e.target.value.trim())}
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
                <button type="button" onClick={() => onToggle(item)}>
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
        <p className="admin-muted">Zatiaľ žiadne fotky. Pridaj prvé cez tlačidlo hore.</p>
      )}
    </section>
  );
}
