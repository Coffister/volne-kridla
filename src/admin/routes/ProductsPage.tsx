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
  addProductPhoto,
  createProduct,
  deleteProduct,
  listProducts,
  productPhotoRefs,
  removeProductPhoto,
  reorderProductImages,
  reorderProducts,
  resolvePhotoUrl,
  updateProduct,
  type ProductItem,
  type ProductVariant,
} from "../lib/products";
import { msg } from "../lib/errors";
import { PRODUCT_CATEGORIES } from "@/content/categories";
import { COLOR_PALETTE } from "@/content/colorPalette";

interface PhotoThumb {
  key: string;
  url: string;
}

interface PhotoPickerProps {
  photos: PhotoThumb[];
  onReorder: (from: number, to: number) => void;
  onAddFiles: (files: File[]) => void;
  onRemove: (key: string) => void;
}

/** Draggable photo strip: first thumb is always the main photo. */
function PhotoPicker({ photos, onReorder, onAddFiles, onRemove }: PhotoPickerProps) {
  const dragIndex = useRef<number | null>(null);

  function onDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    onReorder(dragIndex.current, index);
    dragIndex.current = index;
  }

  return (
    <div className="admin-photo-picker">
      {photos.map((photo, i) => (
        <div
          key={photo.key}
          className="admin-photo-thumb"
          draggable
          onDragStart={() => (dragIndex.current = i)}
          onDragOver={(e) => onDragOver(e, i)}
          onDragEnd={() => (dragIndex.current = null)}
        >
          {i === 0 && <span className="admin-photo-thumb-main">Hlavná</span>}
          <img src={photo.url} alt="" />
          <button type="button" onClick={() => onRemove(photo.key)} aria-label="Odstrániť fotku">
            ✕
          </button>
        </div>
      ))}
      <label className="admin-photo-add">
        + Foto
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            onAddFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

/** "S, M, L" -> ["S", "M", "L"] */
function parseOptions(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

interface VariantGroupsEditorProps {
  groups: ProductVariant[];
  onLabelChange: (i: number, label: string) => void;
  onToggleIsColor: (i: number) => void;
  onOptionsChange: (i: number, options: string[]) => void;
  onRemove: (i: number) => void;
  onAdd: () => void;
}

function VariantGroupsEditor({
  groups,
  onLabelChange,
  onToggleIsColor,
  onOptionsChange,
  onRemove,
  onAdd,
}: VariantGroupsEditorProps) {
  return (
    <div>
      {groups.map((group, i) => (
        <div key={i} className="admin-variant-group">
          <div className="admin-review-form-row">
            <input
              type="text"
              className="admin-field admin-field-sm"
              placeholder="Názov vlastnosti (napr. Farba ľadvinky)"
              defaultValue={group.label}
              onBlur={(e) => onLabelChange(i, e.target.value)}
            />
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={!!group.isColor}
                onChange={() => onToggleIsColor(i)}
              />
              Farba
            </label>
            <button type="button" className="is-danger" onClick={() => onRemove(i)}>
              Zmazať
            </button>
          </div>

          {group.isColor ? (
            <div className="admin-color-swatches">
              {COLOR_PALETTE.map((c) => {
                const selected = group.options.includes(c.label);
                return (
                  <button
                    key={c.label}
                    type="button"
                    title={c.label}
                    className={`admin-color-swatch ${selected ? "is-selected" : ""}`}
                    style={{ background: c.hex }}
                    onClick={() =>
                      onOptionsChange(
                        i,
                        selected
                          ? group.options.filter((o) => o !== c.label)
                          : [...group.options, c.label],
                      )
                    }
                  />
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              className="admin-field admin-field-sm"
              placeholder="Možnosti oddelené čiarkou (napr. S, M, L)"
              defaultValue={group.options.join(", ")}
              onBlur={(e) => onOptionsChange(i, parseOptions(e.target.value))}
            />
          )}
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn-sm" onClick={onAdd}>
        + Pridať vlastnosť
      </button>
    </div>
  );
}

export default function ProductsPage() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [variantGroups, setVariantGroups] = useState<ProductVariant[]>([]);
  const [stockCount, setStockCount] = useState("");
  const [inStock, setInStock] = useState(true);
  const [category, setCategory] = useState("");
  const [adding, setAdding] = useState(false);

  const newPhotos = useMemo(
    () =>
      photoFiles.map((file, i) => ({
        key: String(i),
        url: URL.createObjectURL(file),
      })),
    [photoFiles],
  );

  function onNewPhotosAdd(files: File[]) {
    setPhotoFiles((cur) => [...cur, ...files.filter((f) => f.type.startsWith("image/"))]);
  }

  function onNewPhotosReorder(from: number, to: number) {
    setPhotoFiles((cur) => {
      const next = [...cur];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function onNewPhotosRemove(key: string) {
    setPhotoFiles((cur) => cur.filter((_, i) => String(i) !== key));
  }

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listProducts());
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
    if (!name.trim()) return;
    setAdding(true);
    setError(null);
    try {
      await createProduct({
        sku,
        name,
        description,
        priceLabel,
        photoFiles,
        imageUrl,
        variants: variantGroups.filter((g) => g.label.trim() && g.options.length > 0),
        stockCount: stockCount.trim() ? Number(stockCount) : 0,
        inStock,
        category,
      });
      setSku("");
      setName("");
      setDescription("");
      setPriceLabel("");
      setPhotoFiles([]);
      setImageUrl("");
      setVariantGroups([]);
      setStockCount("");
      setInStock(true);
      setCategory("");
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
      await reorderProducts(next);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function patch(
    item: ProductItem,
    p: Partial<
      Pick<
        ProductItem,
        | "sku"
        | "name"
        | "description"
        | "price_label"
        | "published"
        | "variants"
        | "stock_count"
        | "in_stock"
        | "category"
      >
    >,
  ) {
    setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, ...p } : i)));
    try {
      await updateProduct(item.id, p);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onDelete(item: ProductItem) {
    if (!confirm(`Zmazať produkt „${item.name}"? Nedá sa vrátiť.`)) return;
    setItems((cur) => cur.filter((i) => i.id !== item.id));
    try {
      await deleteProduct(item);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onAddPhotos(item: ProductItem, files: File[]) {
    try {
      for (const file of files) {
        await addProductPhoto(item, file);
      }
      await refresh();
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onRemovePhoto(item: ProductItem, ref: string) {
    try {
      await removeProductPhoto(item, ref);
      await refresh();
    } catch (e) {
      setError(msg(e));
    }
  }

  async function onReorderPhotos(item: ProductItem, order: string[]) {
    const image_path = order[0] && !order[0].startsWith("http") ? order[0] : null;
    const image_url = order[0] && order[0].startsWith("http") ? order[0] : null;
    const images = order.slice(1);
    setItems((cur) =>
      cur.map((it) => (it.id === item.id ? { ...it, image_path, image_url, images } : it)),
    );
    try {
      await reorderProductImages(item, order);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  function patchVariants(item: ProductItem, next: ProductVariant[]) {
    patch(item, { variants: next });
  }

  return (
    <section className="admin-page">
      <header className="admin-page-head">
        <div>
          <h2>Produkty</h2>
          <p className="admin-muted">
            {loading ? "Načítavam…" : `${items.length} produktov`}
          </p>
        </div>
      </header>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-review-form" onSubmit={onAdd}>
        <h3>Pridať produkt</h3>

        <PhotoPicker
          photos={newPhotos}
          onReorder={onNewPhotosReorder}
          onAddFiles={onNewPhotosAdd}
          onRemove={onNewPhotosRemove}
        />
        {photoFiles.length > 1 && (
          <p className="admin-muted" style={{ fontSize: "0.8rem", margin: "-4px 0 0" }}>
            Presuň fotku potiahnutím — prvá v poradí je hlavná.
          </p>
        )}

        <div className="admin-review-form-row">
          <div className="admin-review-form-fields">
            <input
              type="text"
              className="admin-field admin-field-sm"
              placeholder="Kód produktu (SKU, nepovinné)"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <input
              type="text"
              className="admin-field admin-field-sm"
              placeholder="Názov produktu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              className="admin-field admin-field-sm"
              placeholder="Cena (napr. 25 €)"
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
            />
            <textarea
              className="admin-field admin-field-sm"
              placeholder="Popis produktu"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <input
          type="url"
          className="admin-field admin-field-sm"
          placeholder="alebo URL hlavnej fotky (ak nenahrávaš žiadnu)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={photoFiles.length > 0}
        />

        <select
          className="admin-field admin-field-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Bez kategórie</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <VariantGroupsEditor
          groups={variantGroups}
          onLabelChange={(i, label) =>
            setVariantGroups((cur) => cur.map((g, idx) => (idx === i ? { ...g, label } : g)))
          }
          onToggleIsColor={(i) =>
            setVariantGroups((cur) =>
              cur.map((g, idx) => (idx === i ? { ...g, isColor: !g.isColor, options: [] } : g)),
            )
          }
          onOptionsChange={(i, options) =>
            setVariantGroups((cur) => cur.map((g, idx) => (idx === i ? { ...g, options } : g)))
          }
          onRemove={(i) => setVariantGroups((cur) => cur.filter((_, idx) => idx !== i))}
          onAdd={() =>
            setVariantGroups((cur) => [...cur, { label: "", isColor: false, options: [] }])
          }
        />

        <div className="admin-review-form-row">
          <input
            type="number"
            min={0}
            className="admin-field admin-field-sm"
            placeholder="Počet kusov skladom"
            value={stockCount}
            onChange={(e) => setStockCount(e.target.value)}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            Dostupné
          </label>
        </div>

        <button type="submit" className="admin-btn" disabled={adding}>
          {adding ? "Pridávam…" : "Pridať"}
        </button>
      </form>

      <ul className="admin-review-list is-textonly">
        {items.map((item, i) => (
          <li key={item.id} className={item.published ? "" : "is-hidden"}>
            <div className="admin-review-body">
              <PhotoPicker
                photos={productPhotoRefs(item).map((ref) => ({
                  key: ref,
                  url: resolvePhotoUrl(ref),
                }))}
                onReorder={(from, to) => {
                  const refs = productPhotoRefs(item);
                  const next = [...refs];
                  const [moved] = next.splice(from, 1);
                  next.splice(to, 0, moved);
                  void onReorderPhotos(item, next);
                }}
                onAddFiles={(files) => void onAddPhotos(item, files)}
                onRemove={(ref) => void onRemovePhoto(item, ref)}
              />
              <input
                type="text"
                className="admin-field admin-field-sm"
                defaultValue={item.sku}
                placeholder="Kód (SKU)"
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v !== item.sku) patch(item, { sku: v });
                }}
              />
              <input
                type="text"
                className="admin-field admin-field-sm"
                defaultValue={item.name}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== item.name) patch(item, { name: v });
                }}
              />
              <input
                type="text"
                className="admin-field admin-field-sm"
                defaultValue={item.price_label}
                placeholder="Cena"
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v !== item.price_label) patch(item, { price_label: v });
                }}
              />
              <textarea
                className="admin-field admin-field-sm"
                defaultValue={item.description}
                rows={3}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v !== item.description) patch(item, { description: v });
                }}
              />

              <VariantGroupsEditor
                groups={item.variants ?? []}
                onLabelChange={(vi, label) =>
                  patchVariants(
                    item,
                    (item.variants ?? []).map((g, idx) => (idx === vi ? { ...g, label } : g)),
                  )
                }
                onToggleIsColor={(vi) =>
                  patchVariants(
                    item,
                    (item.variants ?? []).map((g, idx) =>
                      idx === vi ? { ...g, isColor: !g.isColor, options: [] } : g,
                    ),
                  )
                }
                onOptionsChange={(vi, options) =>
                  patchVariants(
                    item,
                    (item.variants ?? []).map((g, idx) => (idx === vi ? { ...g, options } : g)),
                  )
                }
                onRemove={(vi) =>
                  patchVariants(
                    item,
                    (item.variants ?? []).filter((_, idx) => idx !== vi),
                  )
                }
                onAdd={() =>
                  patchVariants(item, [
                    ...(item.variants ?? []),
                    { label: "", isColor: false, options: [] },
                  ])
                }
              />

              <div className="admin-review-form-row">
                <input
                  type="number"
                  min={0}
                  className="admin-field admin-field-sm"
                  defaultValue={item.stock_count}
                  placeholder="Kusov skladom"
                  onBlur={(e) => {
                    const v = Number(e.target.value) || 0;
                    if (v !== item.stock_count) patch(item, { stock_count: v });
                  }}
                />
                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    checked={item.in_stock}
                    onChange={(e) => patch(item, { in_stock: e.target.checked })}
                  />
                  Dostupné
                </label>
              </div>

              <select
                className="admin-field admin-field-sm"
                defaultValue={item.category}
                onChange={(e) => patch(item, { category: e.target.value })}
              >
                <option value="">Bez kategórie</option>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

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
        <p className="admin-muted">Zatiaľ žiadne produkty.</p>
      )}
    </section>
  );
}
