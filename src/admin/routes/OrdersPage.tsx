import { useCallback, useEffect, useState } from "react";

import {
  deleteInquiry,
  listInquiries,
  setInquiryHandled,
  type InquiryRow,
} from "../lib/orders";
import { msg } from "../lib/errors";

export default function OrdersPage() {
  const [items, setItems] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listInquiries());
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

  async function toggleHandled(item: InquiryRow) {
    const handled = !item.handled;
    setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, handled } : i)));
    try {
      await setInquiryHandled(item.id, handled);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onDelete(item: InquiryRow) {
    if (!confirm(`Zmazať dopyt od „${item.name}"? Nedá sa vrátiť.`)) return;
    setItems((cur) => cur.filter((i) => i.id !== item.id));
    try {
      await deleteInquiry(item.id);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  const pendingCount = items.filter((i) => !i.handled).length;

  return (
    <section className="admin-page">
      <header className="admin-page-head">
        <div>
          <h2>Objednávky</h2>
          <p className="admin-muted">
            {loading
              ? "Načítavam…"
              : `${items.length} dopytov · ${pendingCount} nevybavených`}
          </p>
        </div>
      </header>

      <p className="admin-muted">
        Zákazníci sem posielajú "Mám záujem" z e-shopu. Email notifikácie zatiaľ
        nie sú zapojené — dopyty treba kontrolovať tu.
      </p>

      {error && <p className="admin-error">{error}</p>}

      <ul className="admin-review-list is-textonly">
        {items.map((item) => (
          <li key={item.id} className={item.handled ? "is-hidden" : ""}>
            <div className="admin-review-body">
              <p style={{ margin: 0, fontWeight: 600 }}>{item.product_name}</p>
              <p style={{ margin: 0 }}>
                {item.name} — <a href={`mailto:${item.email}`}>{item.email}</a>
                {item.phone && ` — ${item.phone}`}
              </p>
              {item.message && <p style={{ margin: 0 }}>{item.message}</p>}
              <p className="admin-muted" style={{ margin: 0 }}>
                {new Date(item.created_at).toLocaleString("sk-SK")}
              </p>
              <div className="admin-gallery-actions">
                <button type="button" onClick={() => toggleHandled(item)}>
                  {item.handled ? "Označiť ako nevybavené" : "Označiť ako vybavené"}
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
        <p className="admin-muted">Zatiaľ žiadne dopyty.</p>
      )}
    </section>
  );
}
