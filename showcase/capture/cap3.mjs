import { chromium } from 'playwright';
import fs from 'fs';
import { installMock } from './mock.mjs';
const OUT = '.capture/raw';
const meta = JSON.parse(fs.readFileSync('.capture/raw/meta-site.json','utf8'));
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--ignore-certificate-errors'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
const p = await ctx.newPage();
await p.route(/umami/, r => r.abort());
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

// ---------- admin (local build of the real admin, mocked backend with real published content)
await installMock(p);
await p.goto('http://127.0.0.1:5174/admin/fotogaleria', { waitUntil: 'networkidle' }); await prep(); await p.mouse.move(-5, -5); await p.waitForTimeout(2000);
const chip = p.getByRole('button', { name: /Spoločný piknik/ }).first();
const revLink = p.locator('nav a', { hasText: 'Recenzie' });
meta.chip = await rect(chip); meta.revLink = await rect(revLink);
await shot('a1');
await mark(chip, 'chip'); await hideEl('[data-cap="chip"]', true); await shot('a1-base', { wait: 150 }); await hideEl('', false);
await isolate('[data-cap="chip"]', true); await shot('a1-chip', { alpha: true, wait: 150 }); await isolate('', false);
meta.tiles1 = await p.evaluate(() => [...document.querySelectorAll('.admin-gallery > li')].slice(0, 12).map(li => { const r = li.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
await chip.click(); await p.mouse.move(-5, -5); await shot('a2', { wait: 1200 });
await revLink.hover(); await shot('a2-hover', { wait: 400 });
await mark(revLink, 'rev'); await isolate('[data-cap="rev"]', true); await shot('a2-rev', { alpha: true, wait: 150 }); await isolate('', false);
await hideEl('[data-cap="rev"]', true); await shot('a2-base', { wait: 150 }); await hideEl('', false);
await revLink.click(); await p.mouse.move(-5, -5); await shot('a3', { wait: 1500 });
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
await b.close();
