import { useCallback, useEffect, useState } from "react";

import {
  deleteInquiry,
  listInquiries,
  setInquiryHandled,
  type InquiryRow,
} from "../lib/orders";
import {
  deleteConsultationInquiry,
  listConsultationInquiries,
  setConsultationInquiryHandled,
  type ConsultationInquiryRow,
} from "../lib/consultations";
import { msg } from "../lib/errors";

export default function OrdersPage() {
  const [items, setItems] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [consultItems, setConsultItems] = useState<ConsultationInquiryRow[]>([]);
  const [consultLoading, setConsultLoading] = useState(true);
  const [consultError, setConsultError] = useState<string | null>(null);

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

  const refreshConsultations = useCallback(async () => {
    setConsultLoading(true);
    try {
      setConsultItems(await listConsultationInquiries());
      setConsultError(null);
    } catch (e) {
      setConsultError(msg(e));
    } finally {
      setConsultLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    void refreshConsultations();
  }, [refresh, refreshConsultations]);

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

  async function toggleConsultHandled(item: ConsultationInquiryRow) {
    const handled = !item.handled;
    setConsultItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, handled } : i)));
    try {
      await setConsultationInquiryHandled(item.id, handled);
    } catch (e) {
      setConsultError(msg(e));
      await refreshConsultations();
    }
  }

  async function onDeleteConsult(item: ConsultationInquiryRow) {
    if (!confirm(`Zmazať dopyt od „${item.name}"? Nedá sa vrátiť.`)) return;
    setConsultItems((cur) => cur.filter((i) => i.id !== item.id));
    try {
      await deleteConsultationInquiry(item.id);
    } catch (e) {
      setConsultError(msg(e));
      await refreshConsultations();
    }
  }

  const pendingCount = items.filter((i) => !i.handled).length;
  const consultPendingCount = consultItems.filter((i) => !i.handled).length;

  return (
    <section className="admin-page">
      <header className="admin-page-head">
        <div>
          <h2>Dopyty</h2>
          <p className="admin-muted">
            {loading
              ? "Načítavam…"
              : `${items.length} dopytov · ${pendingCount} nevybavených`}
          </p>
        </div>
      </header>

      <p className="admin-muted">
        Zákazníci sem posielajú "Mám záujem" z e-shopu. Emailová notifikácia
        chodí automaticky, ale dopyty treba aj tak vybavovať tu.
      </p>

      {error && <p className="admin-error">{error}</p>}

      <ul className="admin-review-list is-textonly">
        {items.map((item) => (
          <li key={item.id} className={item.handled ? "is-hidden" : ""}>
            <div className="admin-review-body">
              <p style={{ margin: 0, fontWeight: 600 }}>{item.product_name}</p>
              <p style={{ margin: 0 }}>
                {item.name} — <a href={`mailto:${encodeURIComponent(item.email)}`}>{item.email}</a>
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

      <header className="admin-page-head" style={{ marginTop: "2rem" }}>
        <div>
          <h2>Konzultácie</h2>
          <p className="admin-muted">
            {consultLoading
              ? "Načítavam…"
              : `${consultItems.length} dopytov · ${consultPendingCount} nevybavených`}
          </p>
        </div>
      </header>

      {consultError && <p className="admin-error">{consultError}</p>}

      <ul className="admin-review-list is-textonly">
        {consultItems.map((item) => (
          <li key={item.id} className={item.handled ? "is-hidden" : ""}>
            <div className="admin-review-body">
              <p style={{ margin: 0, fontWeight: 600 }}>
                {[item.track_label, item.type_label, item.package_label]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p style={{ margin: 0 }}>
                {item.name} — <a href={`mailto:${encodeURIComponent(item.email)}`}>{item.email}</a>
                {item.phone && ` — ${item.phone}`}
              </p>
              {(item.parrot_name || item.species || item.age) && (
                <p style={{ margin: 0 }}>
                  {[
                    item.parrot_name && `Papagáj: ${item.parrot_name}`,
                    item.species,
                    item.age && `${item.age} rokov`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              {item.topic && <p style={{ margin: 0 }}>Téma: {item.topic}</p>}
              {item.details && <p style={{ margin: 0 }}>{item.details}</p>}
              <p className="admin-muted" style={{ margin: 0 }}>
                {new Date(item.created_at).toLocaleString("sk-SK")}
              </p>
              <div className="admin-gallery-actions">
                <button type="button" onClick={() => toggleConsultHandled(item)}>
                  {item.handled ? "Označiť ako nevybavené" : "Označiť ako vybavené"}
                </button>
                <button
                  type="button"
                  className="is-danger"
                  onClick={() => onDeleteConsult(item)}
                >
                  Zmazať
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {!consultLoading && consultItems.length === 0 && (
        <p className="admin-muted">Zatiaľ žiadne dopyty na konzultáciu.</p>
      )}
    </section>
  );
}
