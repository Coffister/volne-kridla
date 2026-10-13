// Build-time prerender entry (see scripts/prerender.mjs): renders one route
// to an HTML string plus the <head> tags its page asked for. Never shipped
// to the browser.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import { AppRoutes } from "./App";
import { site } from "./content";
import { ssrMeta, type DocumentMeta } from "./lib/useDocumentMeta";

export function render(url: string): { html: string; meta: DocumentMeta | null } {
  ssrMeta.current = null;
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, meta: ssrMeta.current };
}

/** Every public URL worth a static HTML file — the fixed pages plus albums
 * and products from the content baked in at build time. */
export function routes(): string[] {
  return [
    "/",
    "/volne-kridla",
    "/o-mne",
    "/pre-skoly",
    "/fotogaleria",
    "/eshop",
    ...site.albums.map((album) => `/fotogaleria/${album.slug}`),
    ...site.products.map((product) => `/eshop/produkt/${product.id}`),
  ];
}
