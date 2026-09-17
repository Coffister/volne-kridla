import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
} from "react";

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

  async function moveTo(from: number, to: number) {
    if (from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next); // optimistic
    try {
      await reorder(next);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  const dragIndex = useRef<number | null>(null);

  function onDragStart(index: number) {
    dragIndex.current = index;
  }

  function onDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    void moveTo(dragIndex.current, index);
    dragIndex.current = index;
  }

  function onDragEnd() {
    dragIndex.current = null;
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
          <li
            key={item.id}
            className={item.published ? "" : "is-hidden"}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDragEnd={onDragEnd}
          >
            <div className="admin-gallery-thumb">
              {i === 0 && <span className="admin-gallery-main">Hlavná fotka</span>}
              <img src={item.url} alt={item.alt} loading="lazy" />
            </div>
            <div className="admin-gallery-body">
              <input
                type="text"
                defaultValue={item.alt}
                placeholder="Popis fotky (alt text)"
                onBlur={(e) => onAltBlur(item, e.target.value.trim())}
              />
              <div className="admin-gallery-actions">
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

      {!loading && items.length > 1 && (
        <p className="admin-muted">Presuň fotku potiahnutím — prvá v poradí je hlavná.</p>
      )}
      {!loading && items.length === 0 && (
        <p className="admin-muted">Zatiaľ žiadne fotky. Pridaj prvé cez tlačidlo hore.</p>
      )}
    </section>
  );
}
