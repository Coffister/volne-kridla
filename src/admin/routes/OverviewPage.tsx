import { site } from "@/content";

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
      <ul className="admin-stats">
        <li>
          <strong>{site.gallery.length}</strong> fotiek v galérii
        </li>
        <li>
          <strong>{site.reviews.length}</strong> recenzií
        </li>
        <li>
          <strong>{Object.keys(site.blocks).length}</strong> textových blokov
        </li>
      </ul>
    </section>
  );
}
