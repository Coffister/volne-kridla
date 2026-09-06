import { useEffect } from "react";

const SITE_NAME = "Voľné krídla";
const SITE_ORIGIN = "https://volnekridla.sk";
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

interface DocumentMetaOptions {
  title: string;
  description: string;
  /** path starting with "/", e.g. "/o-mne" */
  path: string;
  image?: string;
  /** for stub/placeholder pages with no real content yet */
  noindex?: boolean;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let tag = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

/** Sets per-page title, description, canonical URL, and Open Graph / Twitter
 * card tags — this is a client-rendered SPA with no meta-tags library, so
 * every route otherwise shares index.html's single static <title>. */
export function useDocumentMeta({
  title,
  description,
  path,
  image,
  noindex,
}: DocumentMetaOptions) {
  useEffect(() => {
    const url = `${SITE_ORIGIN}${path}`;
    const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertLink("canonical", url);

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image ?? DEFAULT_IMAGE);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image ?? DEFAULT_IMAGE);
  }, [title, description, path, image, noindex]);
}
