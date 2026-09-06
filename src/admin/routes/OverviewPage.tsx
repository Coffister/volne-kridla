import { Link } from "react-router-dom";

import { site } from "@/content";

const actions = [
  {
    to: "/admin/fotogaleria",
    title: "Pridať fotku",
    hint: "Nahrať nové fotky do galérie",
  },
  {
    to: "/admin/recenzie",
    title: "Pridať recenziu",
    hint: "Zapísať novú recenziu klienta",
  },
  {
    to: "/admin/produkty",
    title: "Pridať produkt",
    hint: "Nahrať nový produkt do e-shopu",
  },
  {
    to: "/admin/objednavky",
    title: "Objednávky",
    hint: "Pozrieť dopyty z e-shopu",
  },
  {
    to: "/admin/verzie",
    title: "História verzií",
    hint: "Pozrieť a obnoviť staršie verzie",
  },
];

export default function OverviewPage() {
  return (
    <section className="admin-page">
      <h2>Prehľad</h2>
      <p className="admin-muted">
        Naposledy publikované:{" "}
        {site.publishedAt
          ? new Date(site.publishedAt).toLocaleString("sk-SK")
          : "zatiaľ nikdy (web beží zo základného obsahu)"}
      </p>

      <h3 className="admin-subhead">Rýchle akcie</h3>
      <div className="admin-actions">
        {actions.map((a) => (
          <Link key={a.to} to={a.to} className="admin-action">
            <span className="admin-action-title">{a.title}</span>
            <span className="admin-action-hint">{a.hint}</span>
            <span className="admin-action-go" aria-hidden>
              →
            </span>
          </Link>
        ))}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="admin-action"
        >
          <span className="admin-action-title">Zobraziť web</span>
          <span className="admin-action-hint">Otvoriť verejnú stránku</span>
          <span className="admin-action-go" aria-hidden>
            ↗
          </span>
        </a>
      </div>

      <h3 className="admin-subhead">Stav obsahu</h3>
      <ul className="admin-stats">
        <li>
          <strong>{site.gallery.length}</strong> fotiek v galérii
        </li>
        <li>
          <strong>{site.reviews.length}</strong> recenzií
        </li>
        <li>
          <strong>{site.products.length}</strong> produktov
        </li>
        <li>
          <strong>{Object.keys(site.blocks).length}</strong> textových blokov
        </li>
      </ul>
    </section>
  );
}
