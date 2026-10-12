import { useCallback, useEffect, useState } from "react";

import {
  deletePresentationInquiry,
  listPresentationInquiries,
  setPresentationInquiryHandled,
  type PresentationInquiryRow,
} from "../lib/presentations";
import { msg } from "../lib/errors";

// "2026-10-17" → "so 17. 10. 2026" (parsed as a local date — no timezone shift)
const dayFormat = new Intl.DateTimeFormat("sk-SK", {
  weekday: "short",
  day: "numeric",
  month: "numeric",
  year: "numeric",
});
function formatDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return dayFormat.format(new Date(y, m - 1, d));
}
function formatRange(from: string, to: string): string {
  return from === to ? formatDay(from) : `${formatDay(from)} – ${formatDay(to)}`;
}

// a request whose latest acceptable day has passed can't be booked any more
function isExpired(item: PresentationInquiryRow): boolean {
  const [y, m, d] = item.date_to.split("-").map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(y, m - 1, d) < today;
}

/** Presentation bookings from /pre-skoly (schools and organisations). */
export default function ReservationsPage() {
  const [items, setItems] = useState<PresentationInquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listPresentationInquiries());
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

  async function toggleHandled(item: PresentationInquiryRow) {
    const handled = !item.handled;
    setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, handled } : i)));
    try {
      await setPresentationInquiryHandled(item.id, handled);
    } catch (e) {
      setError(msg(e));
      await refresh();
    }
  }

  async function onDelete(item: PresentationInquiryRow) {
    if (!confirm(`Zmazať rezerváciu „${item.org_name}"? Nedá sa vrátiť.`)) return;
    setItems((cur) => cur.filter((i) => i.id !== item.id));
    try {
      await deletePresentationInquiry(item.id);
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
          <h2>Rezervácie prezentácií</h2>
          <p className="admin-muted">
            {loading
              ? "Načítavam…"
              : `${items.length} rezervácií · ${pendingCount} nevybavených`}
          </p>
        </div>
      </header>

      <p className="admin-muted">
        Školy a organizácie sem posielajú rezervácie zo stránky „Pre školy“.
        E-mailová notifikácia chodí automaticky, vybavené si tu označ.
      </p>

      {error && <p className="admin-error">{error}</p>}

      <ul className="admin-review-list is-textonly">
        {items.map((item) => {
          const expired = !item.handled && isExpired(item);
          return (
            <li key={item.id} className={item.handled ? "is-hidden" : ""}>
              <div className="admin-review-body">
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {item.org_name} · {item.city}
                </p>
                <p className="admin-muted" style={{ margin: 0 }}>
                  {[item.inviter_kind, item.subtype].filter(Boolean).join(" · ")}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Termín:</strong> {formatRange(item.date_from, item.date_to)}
                  {expired && (
                    <span style={{ marginLeft: 8, color: "var(--danger)", fontWeight: 600 }}>
                      (termín už uplynul)
                    </span>
                  )}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Účastníci:</strong> {item.participants} · {item.age_group}
                </p>
                <p style={{ margin: 0 }}>
                  {item.name} —{" "}
                  <a href={`mailto:${encodeURIComponent(item.email)}`}>{item.email}</a>
                  {item.phone && (
                    <>
                      {" — "}
                      <a href={`tel:${item.phone.replace(/\s+/g, "")}`} style={{ whiteSpace: "nowrap" }}>
                        {item.phone}
                      </a>
                    </>
                  )}
                </p>
                {item.note && <p style={{ margin: 0, whiteSpace: "pre-line" }}>{item.note}</p>}
                <p className="admin-muted" style={{ margin: 0 }}>
                  Prijaté {new Date(item.created_at).toLocaleString("sk-SK")}
                </p>
                <div className="admin-gallery-actions">
                  <button type="button" onClick={() => toggleHandled(item)}>
                    {item.handled ? "Označiť ako nevybavené" : "Označiť ako vybavené"}
                  </button>
                  <button type="button" className="is-danger" onClick={() => onDelete(item)}>
                    Zmazať
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {!loading && items.length === 0 && (
        <p className="admin-muted">Zatiaľ žiadne rezervácie.</p>
      )}
    </section>
  );
}
