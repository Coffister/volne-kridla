// Captures real UI states of volnekridla.sk for the HyperFrames compositions.
//
//   node capture/capture.mjs [clip...]      (default: all clips)
//
// Public clips are captured from the live site (real content and photos).
// Network writes are intercepted so nothing reaches the production database,
// the owner's inbox or the analytics. The admin is captured from the local dev
// server (`npm run dev` in the repo root with VITE_SUPABASE_URL=https://mock.supabase.co)
// with anonymized rows served by the mock below — the admin UI code is the real one.
//
// Output per clip: assets/<clip>/*.png (2x DPR stills), *.mp4 (scroll sequences)
// and meta.js (element boxes in site CSS px, read by the composition).
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LIVE = "https://volnekridla.sk";
const LOCAL = process.env.LOCAL ?? "http://localhost:5173";
const VIEWPORT = { width: 1440, height: 810 };
const FPS = 30;

// ---------------------------------------------------------------- helpers

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

async function open(browser, url, { init } = {}) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    reducedMotion: "reduce", // reveal-on-scroll shows content without waiting for scroll triggers
    locale: "sk-SK",
    timezoneId: "Europe/Bratislava",
  });
  // never touch production writes or analytics from a capture
  await ctx.route(/cloud\.umami\.is|umami\.dev/, (r) => r.abort());
  await ctx.route(/\/functions\/v1\//, (r) => r.fulfill({ status: 200, json: { ok: true } }));
  await ctx.route(/\/rest\/v1\/(consultation|product|presentation)_inquiries/, (r) =>
    r.request().method() === "GET" ? r.continue() : r.fulfill({ status: 201, body: "" }),
  );
  // freeze the hero photo carousel (3 s autoplay) so a still and a scroll
  // sequence captured seconds apart show the same photo
  await ctx.addInitScript(() => {
    const orig = window.setInterval;
    window.setInterval = (fn, ms, ...a) => (ms === 3000 || ms === 4000 ? 0 : orig(fn, ms, ...a));
  });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  // the sandbox proxy occasionally answers with a bare error page — retry
  for (let i = 0; i < 4; i++) {
    await page.goto(url, { waitUntil: "networkidle" });
    if (await page.locator("header").count()) break;
    await page.waitForTimeout(2000 * (i + 1));
  }
  // the site's own drawn cursor is re-created in the composition from the same PNGs
  await page.addStyleTag({
    content: `[class*="follower"]{display:none!important}
      [class*="marquee"],[class*="track"]{animation-play-state:paused!important}`,
  });
  await page.waitForTimeout(1200);
  return page;
}

async function settle(page, ms = 900) {
  await page.waitForTimeout(ms);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

// load lazy images / settle layout by walking the page once
async function warm(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, 1500);
}

async function box(page, locator) {
  const b = await locator.first().boundingBox();
  if (!b) throw new Error(`no box for ${locator}`);
  return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
}

const pageY = (page, locator) =>
  locator.first().evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

// eased scroll from → to, one screenshot per frame, encoded to mp4
async function scrollSequence(page, dir, name, from, to, seconds, scroller = null) {
  const frames = Math.round(seconds * FPS);
  const tmp = join(dir, `.${name}`);
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  for (let i = 0; i < frames; i++) {
    const y = from + (to - from) * easeInOut(i / (frames - 1));
    await page.evaluate(
      ([y, sel]) => (sel ? (document.querySelector(sel).scrollTop = y) : window.scrollTo(0, y)),
      [y, scroller],
    );
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({ path: join(tmp, `${String(i).padStart(4, "0")}.png`) });
  }
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", String(FPS), "-i", join(tmp, "%04d.png"),
    "-c:v", "libx264", "-preset", "slow", "-crf", "12", "-pix_fmt", "yuv420p",
    join(dir, `${name}.mp4`),
  ]);
  // still of the last frame, shown once the video clip has ended
  copyFileSync(join(tmp, `${String(frames - 1).padStart(4, "0")}.png`), join(dir, `${name}-end.png`));
  rmSync(tmp, { recursive: true, force: true });
  return { frames, seconds: frames / FPS };
}

function clipDir(clip) {
  const dir = join(ROOT, "assets", clip);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
}

function writeMeta(dir, meta) {
  writeFileSync(join(dir, "meta.js"), `window.META = ${JSON.stringify(meta, null, 2)};\n`);
}

// ---------------------------------------------------------------- clips

const clips = {
  async homepage(browser) {
    const dir = clipDir("homepage");
    const page = await open(browser, LIVE + "/");
    await warm(page);
    await page.screenshot({ path: join(dir, "top.png") });
    const headline = await box(page, page.locator("h1, h2").filter({ hasText: "Dopraj svojmu" }));
    const about = await pageY(page, page.getByText("O Voľných krídlach", { exact: true }));
    const to = Math.round(about - 120);
    const seq = await scrollSequence(page, dir, "scroll", 0, to, 2.6);
    writeMeta(dir, { headline, scrollTo: to, seq });
    await page.context().close();
  },

  async services(browser) {
    const dir = clipDir("services");
    const page = await open(browser, LIVE + "/");
    await page.screenshot({ path: join(dir, "home.png") });
    const link = page.locator("header a:visible", { hasText: "Pre školy" });
    const navLink = await box(page, link);
    await link.first().hover();
    await settle(page, 500);
    await page.screenshot({ path: join(dir, "home-hover.png") });
    await link.first().click();
    await page.waitForURL("**/pre-skoly");
    // park the mouse: the /pre-skoly navbar is laid out differently, and a
    // pointer left at the old spot would hover a different link
    await page.mouse.move(1100, 700);
    await settle(page, 2000);
    await warm(page);
    await page.screenshot({ path: join(dir, "skoly.png") });
    const cards = await pageY(page, page.getByText("Čo vás čaká?", { exact: true }));
    const to = Math.round(cards - 170);
    const seq = await scrollSequence(page, dir, "scroll", 0, to, 2.0);
    writeMeta(dir, { navLink, scrollTo: to, seq });
    await page.context().close();
  },

  // 03 + 04 share the consultation modal
  async "inquiry-form"(browser) {
    const dir = clipDir("inquiry-form");
    // same state as the hero "Konzultácie"-less entry: no track picked yet
    const page = await open(browser, LIVE + "/?konzultacia=1");
    await settle(page, 1200);
    const dialog = page.locator('[role="dialog"]');
    await page.screenshot({ path: join(dir, "s0.png") });
    const track = page.getByRole("tab", { name: "Konzultácie" });
    const meta = { track: await box(page, track) };
    await track.click();
    await settle(page, 1300);
    await page.screenshot({ path: join(dir, "s1.png") });
    const pkg = page.locator("label", { hasText: "Komplexná podpora" });
    meta.pkg = await box(page, pkg);
    await pkg.first().click();
    await settle(page, 900);
    await page.screenshot({ path: join(dir, "s2.png") });
    const next = page.getByRole("button", { name: "Pokračovať" });
    meta.next = await box(page, next);
    await next.first().click();
    await settle(page, 1100);
    await page.screenshot({ path: join(dir, "s3.png") });
    const nameInput = page.locator("#k-parrot-name");
    meta.nameInput = await box(page, nameInput);
    await nameInput.click();
    await settle(page, 300);
    await page.screenshot({ path: join(dir, "s4-focus.png") });
    const typed = "Kiwi";
    for (let i = 1; i <= typed.length; i++) {
      await nameInput.fill(typed.slice(0, i));
      await settle(page, 150);
      await page.screenshot({ path: join(dir, `s4-type${i}.png`) });
    }
    meta.typedCount = typed.length;
    meta.dialog = await box(page, dialog);
    writeMeta(dir, meta);
    await page.context().close();
  },

  async "conditional-form"(browser) {
    const dir = clipDir("conditional-form");
    const page = await open(browser, LIVE + "/?konzultacia=1&vetva=konzultacia");
    await settle(page, 1200);
    await page.locator("label", { hasText: "Online konzultácia" }).first().click();
    await settle(page, 1100);
    await page.screenshot({ path: join(dir, "konzultacia.png") });
    const kurzPill = page.getByRole("tab", { name: "Kurz voľného lietania" });
    const konzPill = page.getByRole("tab", { name: "Konzultácie" });
    const meta = { kurzPill: await box(page, kurzPill), konzPill: await box(page, konzPill) };
    await kurzPill.click();
    await settle(page, 1200);
    await page.screenshot({ path: join(dir, "kurz.png") });
    meta.kurzPkg = await box(page, page.locator("label", { hasText: "340" }));
    // back on the consultation track the previous type/package choice is reset
    // by the real modal; capture what it actually shows instead of assuming
    await konzPill.click();
    await settle(page, 1200);
    await page.screenshot({ path: join(dir, "konzultacia-back.png") });
    writeMeta(dir, meta);
    await page.context().close();
  },

  async "submission-success"(browser) {
    const dir = clipDir("submission-success");
    const page = await open(browser, LIVE + "/?konzultacia=1&vetva=konzultacia");
    await settle(page, 1200);
    await page.locator("label", { hasText: "Online konzultácia" }).first().click();
    await settle(page, 700);
    await page.locator("label", { hasText: "Komplexná podpora" }).first().click();
    await settle(page, 500);
    await page.getByRole("button", { name: "Pokračovať" }).first().click();
    await settle(page, 900);
    await page.locator("#k-species").selectOption("Žako");
    await page.locator("#k-parrot-name").fill("Kiwi");
    await page.locator("#k-age").fill("4");
    await page.locator("#k-topic").selectOption("Správanie");
    await page.getByRole("button", { name: "Pokračovať" }).first().click();
    await settle(page, 900);
    await page.locator("#k-name").fill("Jana Kováčová");
    await page.locator("#k-email").fill("jana.kovacova@example.com");
    await page.locator("#k-phone").fill("900123456");
    await settle(page, 600);
    await page.screenshot({ path: join(dir, "filled.png") });
    const consent = page.locator('input[type="checkbox"]');
    const meta = { consent: await box(page, consent.locator("xpath=..")) };
    await consent.first().check();
    await settle(page, 500);
    await page.screenshot({ path: join(dir, "consent.png") });
    const submit = page.getByRole("button", { name: "Odoslať dopyt" });
    meta.submit = await box(page, submit);
    const posted = page.waitForRequest((r) => /consultation_inquiries/.test(r.url()) && r.method() === "POST");
    await submit.click();
    meta.postedBody = JSON.parse((await posted).postData());
    await settle(page, 4200); // let the one-shot confetti finish
    await page.screenshot({ path: join(dir, "success.png") });
    meta.success = await box(page, page.locator('[role="dialog"]'));
    writeMeta(dir, meta);
    await page.context().close();
  },

  async "admin-overview"(browser) {
    const dir = clipDir("admin-overview");
    const page = await openAdmin(browser, "/admin");
    await page.screenshot({ path: join(dir, "overview.png") });
    const card = page.locator(".admin-action", { hasText: "Pozrieť dopyty z e-shopu" });
    const meta = { card: await box(page, card) };
    await card.hover();
    await settle(page, 400);
    await page.screenshot({ path: join(dir, "overview-hover.png") });
    await card.click();
    await page.waitForURL("**/admin/objednavky");
    await settle(page, 1200);
    await page.screenshot({ path: join(dir, "dopyty.png") });
    const record = page.locator(".admin-review-list li", { hasText: "Kiwi" });
    const main = ".admin-main";
    const recTop = await record.first().evaluate(
      (el, sel) => el.getBoundingClientRect().top + document.querySelector(sel).scrollTop,
      main,
    );
    const to = Math.round(recTop - 140);
    meta.seq = await scrollSequence(page, dir, "scroll", 0, to, 1.4, main);
    meta.record = await box(page, record);
    meta.scrollTo = to;
    writeMeta(dir, meta);
    await page.context().close();
  },

  async "inquiry-status"(browser) {
    const dir = clipDir("inquiry-status");
    const page = await openAdmin(browser, "/admin/objednavky");
    const record = page.locator(".admin-review-list li", { hasText: "Kiwi" });
    await record.first().evaluate((el) => {
      const main = document.querySelector(".admin-main");
      main.scrollTop = el.getBoundingClientRect().top + main.scrollTop - 140;
    });
    await settle(page, 600);
    await page.screenshot({ path: join(dir, "open.png") });
    const btn = record.getByRole("button", { name: "Označiť ako vybavené" });
    const meta = { record: await box(page, record), button: await box(page, btn) };
    const patched = page.waitForRequest((r) => /consultation_inquiries/.test(r.url()) && r.method() === "PATCH");
    await btn.click();
    meta.patchBody = JSON.parse((await patched).postData());
    await settle(page, 700);
    await page.screenshot({ path: join(dir, "handled.png") });
    const back = record.getByRole("button", { name: "Označiť ako nevybavené" });
    meta.buttonBack = await box(page, back);
    await back.click();
    await settle(page, 700);
    await page.screenshot({ path: join(dir, "reopened.png") });
    // the consultation header lives above the scrolled list — keep its count
    meta.headers = await page.locator(".admin-page-head .admin-muted").allTextContents();
    writeMeta(dir, meta);
    await page.context().close();
  },
};

// ---------------------------------------------------------------- admin mock

// Anonymized rows: names, e-mails (example.com) and phones are made up; labels
// are the real ones from src/features/konzultacia-modal/data.ts.
const MOCK = {
  // the live e-shop currently lists no products, so no e-shop inquiries either
  product_inquiries: [],
  consultation_inquiries: [
    { id: "c1", track_label: "Konzultácie", type_label: "Online konzultácia", package_label: "Komplexná podpora", parrot_name: "Kiwi", species: "Žako", age: "4", topic: "Správanie", details: "Kiwi kričí, keď odídem z izby. Chcela by som s tým začať pracovať.", name: "Jana Kováčová", email: "jana.kovacova@example.com", phone: "+421 900 123 456", note: "", consent: true, handled: false, created_at: "2026-10-19T18:05:00Z" },
    { id: "c2", track_label: "Kurz voľného lietania", type_label: "", package_label: "", parrot_name: "Rio", species: "Ara", age: "2", topic: "Voľné lietanie", details: "", name: "Tomáš Baláž", email: "tomas.b@example.com", phone: "", note: "", consent: true, handled: false, created_at: "2026-10-16T11:30:00Z" },
    { id: "c3", track_label: "Konzultácie", type_label: "Osobná konzultácia", package_label: "Základná konzultácia", parrot_name: "Coco", species: "Kakadu", age: "7", topic: "Výcvik", details: "", name: "Lucia Mrázová", email: "lucia.m@example.com", phone: "", note: "", consent: true, handled: true, created_at: "2026-10-09T08:20:00Z" },
  ],
  presentation_inquiries: [],
  // same as the live site: in-person consultation currently hidden
  site_sections: [{ key: "osobna", visible: false }],
};

function fakeJwt() {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  return `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: "00000000-0000-0000-0000-000000000001", role: "authenticated", exp: 4102444800 })}.sig`;
}

async function openAdmin(browser, path) {
  const session = {
    access_token: fakeJwt(),
    refresh_token: "mock",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: 4102444800,
    user: { id: "00000000-0000-0000-0000-000000000001", aud: "authenticated", role: "authenticated", email: "admin@example.com", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" },
  };
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, locale: "sk-SK", timezoneId: "Europe/Bratislava" });
  await ctx.addInitScript((s) => localStorage.setItem("vk-admin-auth", JSON.stringify(s)), session);
  await ctx.route("https://mock.supabase.co/**", (route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.pathname === "/rest/v1/rpc/is_admin") return route.fulfill({ json: true });
    const table = url.pathname.match(/^\/rest\/v1\/([^/]+)$/)?.[1];
    if (req.method() !== "GET") return route.fulfill({ status: 204, body: "" });
    const rows = MOCK[table] ?? [];
    const single = (req.headers()["accept"] ?? "").includes("vnd.pgrst.object");
    return route.fulfill({ json: single ? rows[0] ?? null : rows });
  });
  const page = await ctx.newPage();
  await page.goto(LOCAL + path, { waitUntil: "networkidle" });
  await page.locator(".admin-page h2").first().waitFor();
  await settle(page, 1200);
  return page;
}

// ---------------------------------------------------------------- main

const wanted = process.argv.slice(2);
const browser = await chromium.launch();
for (const [name, fn] of Object.entries(clips)) {
  if (wanted.length && !wanted.includes(name)) continue;
  console.log(`capturing ${name}…`);
  await fn(browser);
}
await browser.close();
