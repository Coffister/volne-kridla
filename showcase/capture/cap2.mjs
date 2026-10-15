import { chromium } from 'playwright';
import fs from 'fs';
import { installMock } from './mock.mjs';
const OUT = '.capture/raw';
const meta = {};
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY, bypass: '127.0.0.1,mock.supabase.test' }, args: ['--ignore-certificate-errors'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
const p = await ctx.newPage();
await p.route(/umami|analytics/, r => r.abort());
const prep = () => p.evaluate(() => {
  const s = document.createElement('style'); s.id = 'cap-base'; s.textContent = 'html{scrollbar-width:none} ::-webkit-scrollbar{display:none} *{caret-color:transparent!important}'; document.head.append(s);
  for (const el of document.querySelectorAll('div[aria-hidden="true"]')) { const cs = getComputedStyle(el); if (cs.position === 'fixed' && cs.pointerEvents === 'none' && el.querySelector('img')) el.style.display = 'none'; }
});
const rect = (loc) => loc.boundingBox();
// isolate: only `sel` (and descendants) painted, transparent page → alpha PNG
const isolate = (sel, on) => p.evaluate(([sel, on]) => {
  document.getElementById('cap-iso')?.remove();
  if (!on) return;
  const s = document.createElement('style'); s.id = 'cap-iso';
  s.textContent = `html,body{background:transparent!important} body *{visibility:hidden!important} ${sel},${sel} *{visibility:visible!important} *::before,*::after{visibility:hidden!important} ${sel} *::before,${sel} *::after{visibility:visible!important}`;
  document.head.append(s);
}, [sel, on]);
const hideEl = (sel, on) => p.evaluate(([sel, on]) => { document.getElementById('cap-hide')?.remove(); if (on) { const s = document.createElement('style'); s.id = 'cap-hide'; s.textContent = `${sel}{visibility:hidden!important}`; document.head.append(s); } }, [sel, on]);
const mark = (loc, id) => loc.evaluate((el, id) => el.setAttribute('data-cap', id), id);
const shot = async (n, opts = {}) => { await p.waitForTimeout(opts.wait ?? 900); await p.screenshot({ path: `${OUT}/${n}.png`, omitBackground: !!opts.alpha }); console.log('shot', n); };
// card state + optional pressable layer (button isolated, card with button hidden)
const card = async (n, pressLoc) => {
  await isolate('[role=dialog]', true); await shot(n, { alpha: true });
  if (pressLoc) {
    await mark(pressLoc, n); meta[n] = await rect(pressLoc);
    await hideEl(`[data-cap="${n}"]`, true); await shot(`${n}-base`, { alpha: true, wait: 150 }); await hideEl('', false);
    await isolate(`[data-cap="${n}"]`, true); await shot(`${n}-btn`, { alpha: true, wait: 150 });
  }
  await isolate('', false);
};

// ---------- website
await p.goto('https://volnekridla.sk/', { waitUntil: 'networkidle', timeout: 90000 });
await prep(); await p.mouse.move(-5, -5); await p.waitForTimeout(2500);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 200) { await p.mouse.wheel(0, 200); await p.waitForTimeout(120); }
await p.waitForTimeout(1500); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1000);
await p.screenshot({ path: `${OUT}/home-full.png`, fullPage: true }); meta.homeH = H;
const cta = p.getByRole('button', { name: /Začať lietať/ }).first();
const nav = cta.locator('xpath=ancestor::nav[1] | ancestor::header[1]').first();
meta.nav = await rect(nav); meta.navCta = await rect(cta);
await mark(nav, 'nav'); await isolate('[data-cap="nav"]', true); await shot('nav', { alpha: true }); await isolate('', false);
await mark(cta, 'cta'); await isolate('[data-cap="cta"]', true); await shot('nav-cta', { alpha: true }); await isolate('', false);
// testimonials anchor for the closing composition
meta.reviewsY = await p.evaluate(() => { const h = [...document.querySelectorAll('h2,h3,p,span')].find(e => /Vidíš ich/.test(e.textContent)); return h ? h.getBoundingClientRect().top + scrollY : null; });

// ---------- form (never submitted)
await p.goto('https://volnekridla.sk/?konzultacia=1', { waitUntil: 'networkidle', timeout: 90000 });
await prep(); await p.mouse.move(-5, -5); await p.waitForTimeout(1500);
const dlg = p.locator('[role=dialog]');
meta.card = {};
const L = { konz: dlg.getByText('Konzultácie', { exact: true }), online: dlg.locator('label', { hasText: 'Online konzultácia' }), pkg: dlg.locator('label', { hasText: 'Komplexná podpora' }), next: dlg.getByRole('button', { name: 'Pokračovať' }) };
await card('f1', L.konz); meta.card.f1 = await rect(dlg);
await L.konz.click(); await p.mouse.move(-5, -5); await p.waitForTimeout(600);
await card('f2', L.online); meta.card.f2 = await rect(dlg);
await L.online.click(); await p.mouse.move(-5, -5); await p.waitForTimeout(600);
await card('f3', L.pkg); meta.card.f3 = await rect(dlg);
await L.pkg.click(); await p.mouse.move(-5, -5); await p.waitForTimeout(600);
await card('f4', L.next); meta.card.f4 = await rect(dlg);
await L.next.click(); await p.mouse.move(-5, -5); await p.waitForTimeout(1200);
await card('f5'); meta.card.f5 = await rect(dlg);
meta.name = await rect(p.locator('#k-parrot-name')); meta.species = await rect(p.locator('#k-species'));
await p.selectOption('#k-species', { index: 1 }); await p.locator('#k-species').blur();
await p.locator('#k-parrot-name').focus(); await p.waitForTimeout(400); await card('f6');
const nm = 'Kiwi'; for (let i = 1; i <= nm.length; i++) { await p.locator('#k-parrot-name').fill(nm.slice(0, i)); await p.waitForTimeout(200); await card(`f7-${i}`); }
meta.card.f7 = await rect(dlg);

fs.writeFileSync(`${OUT}/meta-site.json`, JSON.stringify(meta, null, 1));
await b.close();
