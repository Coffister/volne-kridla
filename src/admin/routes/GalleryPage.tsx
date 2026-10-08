import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from "react";

import {
  createAlbum,
  deleteAlbum,
  deleteImage,
  listAlbums,
  listGallery,
  moveToAlbum,
  reorder,
  updateAlbum,
  updateImage,
  uploadImage,
  type AlbumRow,
  type GalleryItem,
} from "../lib/gallery";
import { msg } from "../lib/errors";

const PHOTO = ["fotka", "fotky", "fotiek"] as const;
const FOLDER = ["priečinok", "priečinky", "priečinkov"] as const;

function countLabel(n: number, forms: readonly [string, string, string]) {
  return `${n} ${n === 1 ? forms[0] : n >= 2 && n <= 4 ? forms[1] : forms[2]}`;
}

/** "all" = every photo, "none" = photos without an album, else an album id */
type View = "all" | "none" | string;

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<AlbumRow[]>([]);
  const [view, setView] = useState<View>("all");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [moveTarget, setMoveTarget] = useState<string>("");
  const [creating, setCreating] = useState(false);
  // settings start open only for a folder created just now
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const busy = progress !== null;
  const album = albums.find((a) => a.id === view) ?? null;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [imgs, albs] = await Promise.all([listGallery(), listAlbums()]);
      setItems(imgs);
      setAlbums(albs);
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

  // an album deleted elsewhere (or by us) shouldn't leave us on a dead view
  useEffect(() => {
    if (!loading && view !== "all" && view !== "none" && !album) setView("all");
  }, [loading, view, album]);

  const visible = useMemo(
    () =>
      view === "all"
        ? items
        : items.filter((i) => (view === "none" ? !i.album_id : i.album_id === view)),
    [items, view],
  );

  const counts = useMemo(() => {
    const m = new Map<string | null, number>();
    for (const i of items) m.set(i.album_id, (m.get(i.album_id) ?? 0) + 1);
    return m;
  }, [items]);

  function switchView(next: View) {
    setView(next);
    setSelected(new Set());
  }

  // ------------------------------------------------------------- uploads --

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const albumId = album?.id ?? null;
    setError(null);
    try {
      for (const [n, file] of list.entries()) {
        setProgress(`Nahrávam ${n + 1}/${list.length}…`);
        const item = await uploadImage(file, albumId);
        // show each photo as it lands so a long batch visibly progresses
        setItems((cur) => [...cur, item]);
      }
    } catch (e) {
      setError(msg(e));
      await refresh();
    } finally {
      setProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // ------------------------------------------------------------ ordering --

  // Reorder within the current view: the visible photos keep the slots they
  // occupy in the full list, only their order among themselves changes. That
  // way reordering an album never shuffles photos of other albums.
  async function moveTo(from: number, to: number) {
    if (from === to || to < 0 || to >= visible.length) return;
    const nextVisible = [...visible];
    const [moved] = nextVisible.splice(from, 1);
    nextVisible.splice(to, 0, moved);

    const visibleIds = new Set(visible.map((i) => i.id));
    let k = 0;
    const next = items.map((i) => (visibleIds.has(i.id) ? nextVisible[k++] : i));

    setItems(next.map((it, i) => ({ ...it, sort_order: i }))); // optimistic
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

  // -------------------------------------------------------- photo edits --

  async function patchItem(
    item: GalleryItem,
    patch: Partial<Pick<GalleryItem, "alt" | "published" | "album_id">>,
  ) {
    setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));
    try {
      await updateImage(item.id, patch);
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

  function toggleSelected(id: string) {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function onMoveSelected() {
    const ids = [...selected];
    const albumId = moveTarget || null;
    setItems((cur) =>
      cur.map((i) => (selected.has(i.id) ? { ...i, album_id: albumId } : i)),
    );
    setSelected(new Set());
    setSelecting(false);
    try {
      await moveToAlbum(ids, albumId);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  // -------------------------------------------------------------- albums --

  async function onCreateAlbum(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("title") as HTMLInputElement;
    const title = input.value.trim();
    if (!title) return;
    try {
      const created = await createAlbum(title, albums);
      setAlbums((cur) => [created, ...cur]);
      setCreating(false);
      setJustCreated(created.id);
      switchView(created.id);
    } catch (e) {
      setError(msg(e));
    }
  }

  async function patchAlbum(
    patch: Partial<
      Pick<AlbumRow, "title" | "description" | "event_date" | "cover_image_id" | "published">
    >,
  ) {
    if (!album) return;
    setAlbums((cur) => cur.map((a) => (a.id === album.id ? { ...a, ...patch } : a)));
    try {
      await updateAlbum(album.id, patch);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onDeleteAlbum() {
    if (!album) return;
    if (
      !confirm(
        `Zmazať priečinok „${album.title}“? Fotky v ňom ostanú v galérii ako nezaradené.`,
      )
    )
      return;
    const id = album.id;
    switchView("all");
    setAlbums((cur) => cur.filter((a) => a.id !== id));
    setItems((cur) => cur.map((i) => (i.album_id === id ? { ...i, album_id: null } : i)));
    try {
      await deleteAlbum(id);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  const coverId = album ? (album.cover_image_id ?? visible[0]?.id) : null;

  return (
    <section className="admin-page">
      <header className="admin-page-head">
        <div>
          <h2>Fotogaléria</h2>
          <p className="admin-muted">
            {loading
              ? "Načítavam…"
              : `${countLabel(items.length, PHOTO)} · ${countLabel(albums.length, FOLDER)}`}
          </p>
        </div>
        <label className="admin-btn">
          {progress ?? (album ? "Pridať fotky do priečinka" : "Pridať fotky")}
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

      <nav className="admin-albums" aria-label="Priečinky">
        <button
          type="button"
          className={view === "all" ? "is-current" : ""}
          onClick={() => switchView("all")}
        >
          Všetky <span>{items.length}</span>
        </button>
        <button
          type="button"
          className={view === "none" ? "is-current" : ""}
          onClick={() => switchView("none")}
        >
          Nezaradené <span>{counts.get(null) ?? 0}</span>
        </button>
        {albums.map((a) => (
          <button
            key={a.id}
            type="button"
            className={[view === a.id ? "is-current" : "", a.published ? "" : "is-hidden"]
              .join(" ")
              .trim()}
            onClick={() => switchView(a.id)}
          >
            📁 {a.title || "Bez názvu"} <span>{counts.get(a.id) ?? 0}</span>
          </button>
        ))}
        <button type="button" className="is-add" onClick={() => setCreating((c) => !c)}>
          + Nový priečinok
        </button>
      </nav>

      {creating && (
        <form className="admin-album-new" onSubmit={onCreateAlbum}>
          <input
            name="title"
            type="text"
            className="admin-field admin-field-sm"
            placeholder="Názov, napr. Letný tréning v Senci"
            autoFocus
          />
          <button type="submit" className="admin-btn admin-btn-sm">
            Vytvoriť
          </button>
        </form>
      )}

      {album && (
        <details
          key={album.id}
          className="admin-album-panel"
          open={justCreated === album.id}
        >
          <summary>
            Nastavenia priečinka
            {album.event_date && ` · ${album.event_date.split("-").reverse().join(". ")}`}
            {!album.published && " · skrytý"}
          </summary>
          <div className="admin-album-fields">
            <label>
              <span>Názov</span>
              <input
                type="text"
                className="admin-field admin-field-sm"
                defaultValue={album.title}
                onBlur={(e) => {
                  const title = e.target.value.trim();
                  if (title && title !== album.title) void patchAlbum({ title });
                }}
              />
            </label>
            <label>
              <span>Dátum akcie</span>
              <input
                type="date"
                className="admin-field admin-field-sm"
                defaultValue={album.event_date ?? ""}
                onChange={(e) => void patchAlbum({ event_date: e.target.value || null })}
              />
            </label>
            <label className="is-wide">
              <span>Krátky popis (nepovinné)</span>
              <textarea
                className="admin-field admin-field-sm"
                rows={2}
                defaultValue={album.description}
                placeholder="Čo sa na akcii dialo…"
                onBlur={(e) => {
                  const description = e.target.value.trim();
                  if (description !== album.description) void patchAlbum({ description });
                }}
              />
            </label>
            <div className="admin-gallery-actions is-wide">
              <button
                type="button"
                onClick={() => void patchAlbum({ published: !album.published })}
              >
                {album.published ? "Skryť priečinok" : "Zobraziť priečinok"}
              </button>
              <button type="button" className="is-danger" onClick={onDeleteAlbum}>
                Zmazať priečinok
              </button>
              <span className="admin-muted">
                Adresa: /fotogaleria/{album.slug}
                {!album.published && " · skrytý na webe"}
              </span>
            </div>
          </div>
        </details>
      )}

      {visible.length > 0 && (
        <div className="admin-gallery-toolbar">
          <button
            type="button"
            className="admin-ghost"
            onClick={() => {
              setSelecting((s) => !s);
              setSelected(new Set());
            }}
          >
            {selecting ? "Zrušiť výber" : "Vybrať viac"}
          </button>
          {selecting && (
            <button
              type="button"
              className="admin-ghost"
              onClick={() => setSelected(new Set(visible.map((i) => i.id)))}
            >
              Vybrať všetky ({visible.length})
            </button>
          )}
        </div>
      )}

      <ul className={`admin-gallery${selecting ? " is-selecting" : ""}`}>
        {visible.map((item, i) => (
          <li
            key={item.id}
            className={[
              item.published ? "" : "is-hidden",
              selected.has(item.id) ? "is-selected" : "",
            ]
              .join(" ")
              .trim()}
            draggable={!selecting}
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDragEnd={onDragEnd}
            onClick={selecting ? () => toggleSelected(item.id) : undefined}
          >
            <div className="admin-gallery-thumb">
              {item.id === coverId && <span className="admin-gallery-main">Titulná</span>}
              {selecting && (
                <span className="admin-gallery-check" aria-hidden>
                  {selected.has(item.id) ? "✓" : ""}
                </span>
              )}
              <img src={item.thumbUrl} alt={item.alt} loading="lazy" />
            </div>
            {!selecting && (
              <div className="admin-gallery-body">
                <input
                  type="text"
                  defaultValue={item.alt}
                  placeholder="Popis fotky (alt text)"
                  onBlur={(e) => {
                    const alt = e.target.value.trim();
                    if (alt !== item.alt) void patchItem(item, { alt });
                  }}
                />
                <select
                  className="admin-field admin-field-sm"
                  value={item.album_id ?? ""}
                  aria-label="Priečinok"
                  onChange={(e) => void patchItem(item, { album_id: e.target.value || null })}
                >
                  <option value="">Nezaradené</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      📁 {a.title || "Bez názvu"}
                    </option>
                  ))}
                </select>
                <div className="admin-gallery-actions">
                  <button
                    type="button"
                    aria-label="Posunúť dopredu"
                    onClick={() => moveTo(i, i - 1)}
                    disabled={i === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Posunúť dozadu"
                    onClick={() => moveTo(i, i + 1)}
                    disabled={i === visible.length - 1}
                  >
                    ↓
                  </button>
                  {album && item.id !== coverId && (
                    <button
                      type="button"
                      onClick={() => void patchAlbum({ cover_image_id: item.id })}
                    >
                      Titulná
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void patchItem(item, { published: !item.published })}
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
            )}
          </li>
        ))}
      </ul>

      {selecting && (
        <div className="admin-selection-bar">
          <strong>Vybraté: {selected.size}</strong>
          <select
            className="admin-field admin-field-sm"
            value={moveTarget}
            aria-label="Presunúť do priečinka"
            onChange={(e) => setMoveTarget(e.target.value)}
          >
            <option value="">Nezaradené</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>
                📁 {a.title || "Bez názvu"}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="admin-btn admin-btn-sm"
            disabled={selected.size === 0}
            onClick={onMoveSelected}
          >
            Presunúť
          </button>
        </div>
      )}

      {!loading && visible.length > 1 && !selecting && (
        <p className="admin-muted">
          Poradie zmeníš šípkami ↑ ↓ (na počítači aj potiahnutím).
        </p>
      )}
      {!loading && visible.length === 0 && (
        <p className="admin-muted">
          {album
            ? "Priečinok je prázdny. Pridaj fotky tlačidlom hore alebo presuň existujúce cez „Vybrať viac“."
            : "Zatiaľ žiadne fotky. Pridaj prvé cez tlačidlo hore."}
        </p>
      )}
    </section>
  );
}
