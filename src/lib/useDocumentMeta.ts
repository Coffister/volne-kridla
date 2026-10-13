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

/** Fully resolved tags for one page — what ends up in <head>. */
export interface DocumentMeta {
  title: string;
  description: string;
  robots: string;
  canonical: string;
  /** keyed by the tag's `property` (og:*) or `name` (twitter:*) attribute */
  og: Record<string, string>;
  twitter: Record<string, string>;
}

function resolveMeta({
  title,
  description,
  path,
  image,
  noindex,
}: DocumentMetaOptions): DocumentMeta {
  const url = `${SITE_ORIGIN}${path}`;
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
  const img = image ?? DEFAULT_IMAGE;

  return {
    title: fullTitle,
    description,
    robots: noindex ? "noindex, nofollow" : "index, follow",
    canonical: url,
    og: {
      "og:type": "website",
      "og:site_name": SITE_NAME,
      "og:title": fullTitle,
      "og:description": description,
      "og:url": url,
      "og:image": img,
    },
    twitter: {
      "twitter:card": "summary_large_image",
      "twitter:title": fullTitle,
      "twitter:description": description,
      "twitter:image": img,
    },
  };
}

/** Filled in during the build-time prerender (no `document` there, effects
 * don't run) — scripts/prerender.mjs writes it into the page's <head>. */
export const ssrMeta: { current: DocumentMeta | null } = { current: null };

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
 * card tags. Prerendered pages already ship these in their HTML; this keeps
 * them in sync on client-side navigation between routes. */
export function useDocumentMeta(options: DocumentMetaOptions) {
  const { title, description, path, image, noindex } = options;

  if (typeof document === "undefined") {
    ssrMeta.current = resolveMeta(options);
  }

  useEffect(() => {
    const meta = resolveMeta({ title, description, path, image, noindex });

    document.title = meta.title;
    upsertMeta("name", "description", meta.description);
    upsertMeta("name", "robots", meta.robots);
    upsertLink("canonical", meta.canonical);
    for (const [key, value] of Object.entries(meta.og)) upsertMeta("property", key, value);
    for (const [key, value] of Object.entries(meta.twitter)) upsertMeta("name", key, value);
  }, [title, description, path, image, noindex]);
}
