import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  addProductImage,
  createProduct,
  deleteProduct,
  listProducts,
  removeProductImage,
  reorderProducts,
  updateProduct,
  type ProductItem,
  type ProductVariant,
} from "../lib/products";
import { msg } from "../lib/errors";
import { PRODUCT_CATEGORIES } from "@/content/categories";

/** "Red, Blue, Green" -> ["Red", "Blue", "Green"] */
function parseOptions(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function variantsToText(variants: ProductVariant[], type: "color" | "size"): string {
  return variants.find((v) => v.type === type)?.options.join(", ") ?? "";
}

function buildVariants(colorsText: string, sizesText: string): ProductVariant[] {
  const variants: ProductVariant[] = [];
  const colors = parseOptions(colorsText);
  const sizes = parseOptions(sizesText);
  if (colors.length) variants.push({ type: "color", options: colors });
  if (sizes.length) variants.push({ type: "size", options: sizes });
  return variants;
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
  const [colorsText, setColorsText] = useState("");
  const [sizesText, setSizesText] = useState("");
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
        variants: buildVariants(colorsText, sizesText),
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
      setColorsText("");
      setSizesText("");
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

        <div className="admin-review-form-row">
          <input
            type="text"
            className="admin-field admin-field-sm"
            placeholder="Farby (napr. Červená, Modrá) — nepovinné"
            value={colorsText}
            onChange={(e) => setColorsText(e.target.value)}
          />
          <input
            type="text"
            className="admin-field admin-field-sm"
            placeholder="Veľkosti (napr. S, M, L) — nepovinné"
            value={sizesText}
            onChange={(e) => setSizesText(e.target.value)}
          />
        </div>

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
            {item.image ? (
              <img src={item.image} alt={item.name} loading="lazy" />
            ) : (
              <div className="admin-review-noimg">bez fotky</div>
            )}
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

              <div className="admin-review-form-row">
                <input
                  type="text"
                  className="admin-field admin-field-sm"
                  defaultValue={variantsToText(item.variants ?? [], "color")}
                  placeholder="Farby (čiarkou oddelené)"
                  onBlur={(e) => {
                    const next = buildVariants(
                      e.target.value,
                      variantsToText(item.variants ?? [], "size"),
                    );
                    patch(item, { variants: next });
                  }}
                />
                <input
                  type="text"
                  className="admin-field admin-field-sm"
                  defaultValue={variantsToText(item.variants ?? [], "size")}
                  placeholder="Veľkosti (čiarkou oddelené)"
                  onBlur={(e) => {
                    const next = buildVariants(
                      variantsToText(item.variants ?? [], "color"),
                      e.target.value,
                    );
                    patch(item, { variants: next });
                  }}
                />
              </div>

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
