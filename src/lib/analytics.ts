// Umami Cloud analytics (cookieless — no consent banner needed).
//
// Automatic tracking is off on purpose: the booking modals live in the URL
// query (?konzultacia=1&vetva=…), and Umami's own tracker would count every
// one of those changes as another page view. Instead the router reports a
// page view when the *path* changes (usePageviews), and the forms report
// their own funnel events (trackEvent).
//
// The script is injected only by the public site (never /admin) and only on
// the production domain, so previews, localhost and *.vercel.app send nothing.
// Nothing personal is sent — no names, e-mails, phones or message text.

const WEBSITE_ID = "713b5c8f-dcb3-41ef-88d0-12bfe4ece720";
const DOMAIN = "volnekridla.sk";
const SCRIPT_SRC = "https://cloud.umami.is/script.js";

type EventData = Record<string, string | number>;
type Payload = Record<string, unknown>;
interface Umami {
  track(build: (defaults: Payload) => Payload): void;
}
declare global {
  interface Window {
    umami?: Umami;
  }
}

let started = false;
let queue: ((umami: Umami) => void)[] = [];
let lastPath: string | null = null;
let pendingSource: string | null = null;

/** Loads the tracker once (production domain only). */
export function initAnalytics() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (location.hostname !== DOMAIN) {
    queue = [];
    return;
  }
  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.defer = true;
  script.dataset.websiteId = WEBSITE_ID;
  script.dataset.autoTrack = "false";
  script.dataset.domains = DOMAIN;
  script.onload = () => {
    const umami = window.umami;
    if (umami) queue.forEach((send) => send(umami));
    queue = [];
  };
  document.head.appendChild(script);
}

function send(build: (defaults: Payload) => Payload) {
  if (typeof window === "undefined") return;
  if (started && location.hostname !== DOMAIN) return;
  const umami = window.umami;
  if (umami) umami.track(build);
  else queue.push((u) => u.track(build));
}

/** Current path plus campaign params (utm_*) — the modal params are dropped. */
function currentPath(): string {
  const params = new URLSearchParams(location.search);
  const kept = new URLSearchParams();
  params.forEach((value, key) => {
    if (key.startsWith("utm_") || key === "ref") kept.set(key, value);
  });
  const query = kept.toString();
  return location.pathname + (query ? `?${query}` : "");
}

/** Reports a page view; ignores repeats of the same path. */
export function trackPageview() {
  const path = currentPath();
  if (path === lastPath) return;
  // first view: where the visitor came from (own-site referrers as a path,
  // like Umami's tracker does); afterwards the previous page
  const external = document.referrer.startsWith(location.origin)
    ? document.referrer.slice(location.origin.length) || "/"
    : document.referrer;
  const referrer = lastPath ?? external;
  lastPath = path;
  const url = location.origin + path;
  const title = document.title;
  send((defaults) => ({ ...defaults, url, referrer, title }));
}

/** Reports a funnel event, e.g. "konzultacia-odoslanie". */
export function trackEvent(name: string, data?: EventData) {
  const url = location.origin + currentPath();
  send((defaults) => ({ ...defaults, url, name, ...(data && { data }) }));
}

/** Called by a CTA right before it opens a form, so the form's "opened"
 * event can say where it was opened from. */
export function markOpenSource(source: string) {
  pendingSource = source;
}

/** The source set by the CTA that opened the form — "odkaz" when the form
 * was opened by a link (e.g. ?konzultacia=1 shared on Instagram). */
export function takeOpenSource(): string {
  const source = pendingSource ?? "odkaz";
  pendingSource = null;
  return source;
}
