// Build-time prerender. Runs after the client build (dist/) and the SSR build
// of src/entry-server.tsx (dist-ssr/): renders every public route to static
// HTML so crawlers that don't run JavaScript (AI answer engines, link
// previews) get the real content and <head> tags instead of an empty
// <div id="root">. The browser then hydrates that markup (src/main.tsx).
//
// Output (served by Vercel with cleanUrls, see vercel.json):
//   dist/index.html            "/"
//   dist/<route>.html          every other route, e.g. dist/fotogaleria/<slug>.html
//   dist/404.html              the NotFound page, served with a 404 status
//   dist/spa.html              the empty app shell — fallback for routes that
//                              aren't prerendered (admin, redirects)
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const DIST = "dist";
const SSR_DIST = "dist-ssr";

const { render, routes } = await import(
  pathToFileURL(join(SSR_DIST, "entry-server.js")).href
);

const template = readFileSync(join(DIST, "index.html"), "utf8");
writeFileSync(join(DIST, "spa.html"), template);

const escapeAttr = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const escapeText = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Sets `content` of the meta tag with attr="key" (multiline-tolerant). */
function setMeta(html, attr, key, content) {
  const tag = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);
  const replacement = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`;
  return tag.test(html)
    ? html.replace(tag, replacement)
    : html.replace("</head>", `    ${replacement}\n  </head>`);
}

function applyMeta(html, meta) {
  if (!meta) return html;
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(meta.title)}</title>`);
  out = setMeta(out, "name", "description", meta.description);
  out = setMeta(out, "name", "robots", meta.robots);
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(meta.canonical)}" />`,
  );
  for (const [key, value] of Object.entries(meta.og)) out = setMeta(out, "property", key, value);
  for (const [key, value] of Object.entries(meta.twitter)) out = setMeta(out, "name", key, value);
  return out;
}

function page(url) {
  const { html, meta } = render(url);
  if (!html) throw new Error(`prerender: ${url} rendered nothing`);
  return applyMeta(template, meta).replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`,
  );
}

function write(file, html) {
  const path = join(DIST, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
}

const all = [...routes(), "/ochrana-osobnych-udajov"];
for (const url of all) {
  write(url === "/" ? "index.html" : `${url.slice(1)}.html`, page(url));
}
// any path the router doesn't know renders the catch-all NotFound page
write("404.html", page("/__not-found__"));

rmSync(SSR_DIST, { recursive: true, force: true });
console.log(`prerendered ${all.length} routes + 404`);
