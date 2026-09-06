import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  createProduct,
  deleteProduct,
  listProducts,
  reorderProducts,
  updateProduct,
  type ProductItem,
} from "../lib/products";
import { msg } from "../lib/errors";

export default function ProductsPage() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
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
      await createProduct({ name, description, priceLabel, imageFile, imageUrl });
      setName("");
      setDescription("");
      setPriceLabel("");
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
      await reorderProducts(next);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function patch(
    item: ProductItem,
    p: Partial<Pick<ProductItem, "name" | "description" | "price_label" | "published">>,
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
