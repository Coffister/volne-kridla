import { chromium } from 'playwright';
import fs from 'fs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY }, args: ['--ignore-certificate-errors'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
await p.route(/umami/, r => r.abort());
await p.goto('https://volnekridla.sk/', { waitUntil: 'networkidle', timeout: 90000 });
await p.mouse.move(-5, -5); await p.waitForTimeout(2500);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 200) { await p.mouse.wheel(0, 200); await p.waitForTimeout(120); }
await p.evaluate(() => document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; i.decoding = 'sync'; }));
await p.waitForTimeout(1500);
await p.evaluate(async () => { await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
console.log(await p.evaluate(() => [...document.images].filter(i => !i.complete || !i.naturalWidth).length), 'unloaded');
await p.waitForTimeout(1000); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1000);
await p.getByRole('button', { name: /Začať lietať/ }).first().locator('xpath=ancestor::nav[1] | ancestor::header[1]').first().evaluate(el => el.style.visibility = 'hidden');
await p.evaluate(() => { for (const el of document.querySelectorAll('div[aria-hidden="true"]')) { const cs = getComputedStyle(el); if (cs.position === 'fixed' && cs.pointerEvents === 'none' && el.querySelector('img')) el.style.display = 'none'; } });
await p.waitForTimeout(300);
await p.screenshot({ path: 'raw/home-nonav.png', fullPage: true });
await b.close();
