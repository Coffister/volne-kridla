import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  addProductImage,
  createProduct,
  deleteProduct,
  listProducts,
  removeProductImage,
  reorderProducts,
  replaceProductImage,
  updateProduct,
  type ProductItem,
  type ProductVariant,
} from "../lib/products";
import { msg } from "../lib/errors";
import { PRODUCT_CATEGORIES } from "@/content/categories";
import { COLOR_PALETTE } from "@/content/colorPalette";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [variantGroups, setVariantGroups] = useState<ProductVariant[]>([]);
  const [stockCount, setStockCount] = useState("");
  const [inStock, setInStock] = useState(true);
  const [category, setCategory] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setAvatarPreview(imageUrl.trim() || null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile, imageUrl]);

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
        imageFile,
        imageUrl,
        additionalImageFiles,
        variants: variantGroups.filter((g) => g.label.trim() && g.options.length > 0),
        stockCount: stockCount.trim() ? Number(stockCount) : 0,
        inStock,
        category,
      });
      setSku("");
      setName("");
      setDescription("");
      setPriceLabel("");
      setImageFile(null);
      setImageUrl("");
      setAdditionalImageFiles([]);
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

  async function onReplaceImage(item: ProductItem, file: File) {
    try {
      const image = await replaceProductImage(item, file);
      setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, image } : i)));
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onAddImage(item: ProductItem, file: File) {
    try {
      const images = await addProductImage(item, file);
      setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, images } : i)));
      await refresh();
    } catch (e) {
      setError(msg(e));
    }
  }

  async function onRemoveImage(item: ProductItem, path: string) {
    try {
      const images = await removeProductImage(item, path);
      setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, images } : i)));
      await refresh();
    } catch (e) {
      setError(msg(e));
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

        <div className="admin-review-form-row">
          <label
            className="admin-avatar-upload"
            style={avatarPreview ? { backgroundImage: `url(${avatarPreview})` } : undefined}
          >
            {!avatarPreview && <span>+ Foto</span>}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>

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
          placeholder="alebo URL fotky"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={!!imageFile}
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

        <input
          type="file"
          accept="image/*"
          multiple
          className="admin-field admin-field-sm"
          onChange={(e) => setAdditionalImageFiles(Array.from(e.target.files ?? []))}
        />
        <p className="admin-muted" style={{ fontSize: "0.8rem", margin: "-4px 0 0" }}>
          Ďalšie fotky pre carousel (voliteľné, môžeš vybrať viacero)
        </p>

        <button type="submit" className="admin-btn" disabled={adding}>
          {adding ? "Pridávam…" : "Pridať"}
        </button>
      </form>

      <ul className="admin-review-list">
        {items.map((item, i) => (
          <li key={item.id} className={item.published ? "" : "is-hidden"}>
            <label
              className="admin-avatar-upload"
              style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
              title="Zmeniť fotku"
            >
              {!item.image && <span>+ Foto</span>}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onReplaceImage(item, f);
                  e.target.value = "";
                }}
              />
            </label>
            <div className="admin-review-body">
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

              {/* Additional carousel images */}
              <div className="admin-gallery-actions" style={{ flexWrap: "wrap" }}>
                {item.resolvedImages.map((url, imgIdx) => (
                  <div key={url} style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={url}
                      alt=""
                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                    />
                    <button
                      type="button"
                      className="is-danger"
                      style={{ position: "absolute", top: -6, right: -6, padding: "0 4px" }}
                      onClick={() => onRemoveImage(item, item.images[imgIdx])}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <label className="admin-btn" style={{ cursor: "pointer" }}>
                  + Foto
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onAddImage(item, f);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

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
