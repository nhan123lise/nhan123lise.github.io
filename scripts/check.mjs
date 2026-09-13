// End-to-end merge gate for the static site. One command, all engines × viewports.
//   npx --yes -p playwright@1.55.1 node scripts/check.mjs [baseUrl] [--out dir]
// Exit 1 on any FAIL. Screenshots (first viewport) go to --out (default: OS temp dir).
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const outAt = argv.indexOf('--out');
const OUT = outAt >= 0 ? argv.splice(outAt, 2)[1] : join(tmpdir(), 'portfolio-check');
const BASE = argv[0] || 'http://localhost:4321';
const AXE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';
const ARXIV = 'https://arxiv.org/abs/2608.26186';

const ENGINES = ['chromium', 'firefox', 'webkit'];
const VIEWPORTS = [[1440, 992], [1024, 800], [768, 1024], [390, 844], [320, 568]];
const CHECKS = ['overflow', 'errors', 'fonts', 'notes', 'fold', 'tap', 'struct', 'content', 'axe', 'dialog'];

// `npx -p playwright node …` puts playwright on PATH but not on ESM/CJS resolution paths.
const loadPlaywright = () => {
  for (const bin of (process.env.PATH || '').split(':').filter((p) => p.endsWith('node_modules/.bin'))) {
    try { return createRequire(join(bin, '..', 'x.js'))('playwright'); } catch {}
  }
  return createRequire(import.meta.url)('playwright');
};

// ---------- in-page probes (run in the browser) ----------

const probeOverflow = () => {
  const vw = document.documentElement.clientWidth;
  const bad = [];
  const sw = document.documentElement.scrollWidth;
  if (sw > vw) bad.push(`scrollWidth ${sw} > ${vw}`);
  const scrolls = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { if (/auto|scroll/.test(getComputedStyle(p).overflowX)) return true; } return false; };
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height || el.closest('.visually-hidden, .sprite') || scrolls(el)) continue;
    if (r.left < -1 || r.right > vw + 1) bad.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} [${Math.round(r.left)}, ${Math.round(r.right)}]`);
  }
  return bad;
};

const probeFonts = () => {
  const loaded = (family, weight) => [...document.fonts].some((f) => f.family.replace(/"/g, '') === family && String(f.weight) === weight && f.status === 'loaded');
  const bad = [];
  for (const [family, weight] of [['Bricolage Grotesque', '800'], ['Source Sans 3', '400']]) {
    if (!document.fonts.check(`${weight} 16px "${family}"`) || !loaded(family, weight)) bad.push(`${family} ${weight} not loaded`);
  }
  return bad;
};

// Every rendered .note must be Caveat, loaded, and have every glyph (catches subset gaps).
const probeNotes = async () => {
  const bad = [];
  const notes = [...document.querySelectorAll('.note')].filter((n) => n.getClientRects().length);
  const text = notes.map((n) => n.textContent).join('');
  if (!notes.length) return bad;
  await document.fonts.load('500 40px Caveat', text);
  if (![...document.fonts].some((f) => f.family.replace(/"/g, '') === 'Caveat' && f.status === 'loaded')) bad.push('Caveat not loaded');
  for (const n of notes) {
    const first = getComputedStyle(n).fontFamily.split(',')[0].replace(/["']/g, '').trim();
    if (first !== 'Caveat') bad.push(`"${n.textContent.trim()}" font-family is ${first}`);
  }
  const ctx = document.createElement('canvas').getContext('2d');
  const width = (ch, fallback) => { ctx.font = `500 40px Caveat, ${fallback}`; return ctx.measureText(ch).width; };
  const missing = [...new Set(text.replace(/\s/g, ''))].filter((ch) => width(ch, 'monospace') !== width(ch, 'serif'));
  if (missing.length) bad.push(`glyphs missing from Caveat subset: ${missing.join('')} (re-run pyftsubset with the new note text)`);
  return bad;
};

const probeFold = () => [...document.querySelectorAll('#home li')]
  .filter((li) => li.getBoundingClientRect().bottom > innerHeight)
  .map((li) => `"${li.textContent.trim().slice(0, 40)}" bottom ${Math.round(li.getBoundingClientRect().bottom)} > ${innerHeight}`);

const probeTap = () => [...document.querySelectorAll('a, button, summary')]
  .filter((el) => el.getClientRects().length && !el.closest('.sprite'))
  .filter((el) => !(getComputedStyle(el).display === 'inline' && el.closest('p, li, dd, td')))
  .map((el) => [el, el.getBoundingClientRect()])
  .filter(([, r]) => r.width < 43.5 || r.height < 43.5)
  .map(([el, r]) => `${el.tagName.toLowerCase()} "${(el.textContent.trim() || el.getAttribute('aria-label') || '').slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);

const probeStruct = () => {
  const bad = [];
  const h1 = document.querySelectorAll('h1').length;
  if (h1 !== 1) bad.push(`${h1} h1 elements`);
  if (!document.querySelector('details.xp-item--senior[open]')) bad.push('Senior FPT details not open');
  if (!document.querySelector('details.rs-item--ccu[open]')) bad.push('CCU research details not open');
  if (document.querySelector('hgroup')) bad.push('<hgroup> present');
  return bad;
};

const probeContent = (arxiv) => {
  const bad = [];
  // All text incl. collapsed content; text nodes space-joined (textContent glues "published</p><p>x" into one word).
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (tw.nextNode()) nodes.push(tw.currentNode.data);
  const all = nodes.join(' ').replace(/\s+/g, ' ');
  const visible = document.body.innerText.replace(/\s+/g, ' ');
  if (/\bpublished\b/i.test(all)) bad.push(`"published" appears: …${all.match(/.{0,40}\bpublished\b.{0,20}/i)[0]}…`);
  if (/(7\.16|6\.24|5\.42)\s*%|%\s*\+?(7\.16|6\.24|5\.42)/.test(all)) bad.push('% next to an mAP gain');
  if (!visible.includes('30M+ monthly active users across 13 games')) bad.push('"30M+ monthly active users across 13 games" not visible');
  const arx = [...document.querySelectorAll('a[href*="arxiv"]')].map((a) => a.getAttribute('href'));
  if (!arx.length || arx.some((h) => h !== arxiv)) bad.push(`arXiv hrefs: ${JSON.stringify(arx)}`);
  for (const li of document.querySelectorAll('li')) {
    if (li.textContent.includes('US$43B') && /Executive/.test(li.textContent)) bad.push(`US$43B paired with Executive: "${li.textContent.trim().slice(0, 60)}"`);
  }
  return bad;
};

// ---------- runner ----------

async function checkPage(pw, engine, [w, h], axeSource) {
  const browser = await pw[engine].launch();
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await context.newPage();
  const net = [];
  page.on('pageerror', (e) => net.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => net.push(`failed: ${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => r.status() >= 400 && net.push(`${r.status()}: ${r.url()}`));

  const res = {};
  const run = async (name, applies, fn) => {
    if (!applies) return (res[name] = null);
    try { res[name] = await fn(); } catch (e) { res[name] = [`threw: ${e.message.split('\n')[0]}`]; }
  };

  await page.goto(BASE, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(OUT, `${engine}-${w}x${h}.png`) });

  const chromium = engine === 'chromium';
  await run('overflow', true, () => page.evaluate(probeOverflow));
  await run('fonts', true, () => page.evaluate(probeFonts));
  await run('notes', true, () => page.evaluate(probeNotes));
  await run('fold', w <= 390, () => page.evaluate(probeFold));
  await run('tap', true, () => page.evaluate(probeTap));
  await run('struct', chromium, async () => {
    const bad = await page.evaluate(probeStruct);
    // Computed accessible name straight from Chromium's AX tree.
    const cdp = await context.newCDPSession(page);
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: 'summary' });
    for (const [i, nodeId] of nodeIds.entries()) {
      const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
      if (!nodes[0]?.name?.value?.trim()) bad.push(`summary #${i + 1} has no accessible name`);
    }
    return bad;
  });
  await run('content', true, () => page.evaluate(probeContent, ARXIV));
  await run('axe', chromium && (w === 1440 || w === 390), async () => {
    await page.addScriptTag({ content: axeSource });
    const { violations } = await page.evaluate(() => window.axe.run(document, { resultTypes: ['violations'] }));
    return violations.map((v) => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.nodes[0].target.join(' ')}`);
  });
  await run('dialog', w === 390, async () => {
    const bad = [];
    await page.evaluate(() => scrollTo(0, 0));
    const isOpen = () => page.evaluate(() => document.querySelector('.nav-sheet').open);
    await page.click('.menu-button');
    if (!(await page.evaluate(() => document.querySelector('.nav-sheet').matches(':modal')))) bad.push('dialog not :modal after menu click');
    await page.keyboard.press('Escape');
    if (await isOpen()) bad.push('Escape did not close dialog');
    await page.click('.menu-button');
    await page.click('.nav-sheet a[href="#research"]');
    await page.waitForTimeout(100);
    if (await isOpen()) bad.push('link click did not close dialog');
    const active = await page.evaluate(() => document.activeElement?.id);
    if (active !== 'research') bad.push(`focus on #${active || '(none)'} after link click, expected #research`);
    return bad;
  });
  res.errors = net; // last, so the dialog/axe steps are covered too

  await browser.close();
  return res;
}

const pw = loadPlaywright();
mkdirSync(OUT, { recursive: true });
const axeSource = await (await fetch(AXE_URL)).text();

const rows = [];
for (const engine of ENGINES) {
  for (const vp of VIEWPORTS) {
    let res;
    try { res = await checkPage(pw, engine, vp, axeSource); } catch (e) { res = { errors: [`run crashed: ${e.message.split('\n')[0]}`] }; }
    rows.push({ engine, vp: vp.join('×'), res });
    process.stderr.write('.');
  }
}
process.stderr.write('\n');

const cell = (v) => (v === null || v === undefined ? '–' : v.length ? 'FAIL' : 'ok');
const pad = (s, n) => String(s).padEnd(n);
console.log(`${BASE}  ·  screenshots: ${OUT}\n`);
console.log([pad('engine', 9), pad('viewport', 10), ...CHECKS.map((c) => pad(c, 9)), 'RESULT'].join(''));
const failures = new Map(); // identical details across cells are printed once
for (const { engine, vp, res } of rows) {
  const failed = CHECKS.filter((c) => res[c]?.length);
  for (const c of failed) {
    const detail = res[c].slice(0, 8).join('\n    ') + (res[c].length > 8 ? `\n    …+${res[c].length - 8} more` : '');
    const key = `${c}\n    ${detail}`;
    failures.set(key, [...(failures.get(key) || []), `${engine} ${vp}`]);
  }
  console.log([pad(engine, 9), pad(vp, 10), ...CHECKS.map((c) => pad(cell(res[c]), 9)), failed.length ? 'FAIL' : 'PASS'].join(''));
}
if (failures.size) {
  console.log('\nFailures:');
  for (const [key, cells] of failures) console.log(`  ${key.replace('\n', ` @ ${cells.join(', ')}\n`)}`);
}
process.exit(failures.size ? 1 : 0);
