# Portfolio site — implementation plan

Spec: `docs/superpowers/specs/2026-09-13-portfolio-site-design.md`. Facts: `portfolio.md`.
Visual authority: `design-concepts/DESIGN-HANDOFF.md`. Assets already in `site/assets/` (done).

## Parallel split (no two builders touch the same file)

| Task | Owner | Writes | Model |
|---|---|---|---|
| T1 Shell | builder-shell | `site/index.html` (head, svg sprite, skip link, header, dialog, hero, about, section placeholders, footer), `site/styles.css`, `site/main.js`, `site/_headers` | opus |
| T2 Evidence | builder-evidence | `parts/experience.html`, `parts/research.html`, `parts/evidence.css` | opus |
| T3 Closing | builder-closing | `parts/education.html`, `parts/contact.html`, `parts/closing.css` | sonnet |
| T4 Splice | parent | replaces `<!-- PART:experience -->` etc. in index.html with part files; appends part CSS to styles.css; deletes `parts/` | — |
| T5 Verify | 3 verifier agents (desktop / mobile+keyboard / content+a11y) | screenshots + reports in scratchpad only | sonnet |
| T6 Fix | parent dispatches fixes per finding | — | — |
| T7 Ship | parent | `netlify deploy --dir site` → verify draft → `--prod` → smoke | — |

## Shared contract (T1 implements; T2/T3 only consume + add section-scoped classes)

Section wrapper — T1 writes it; parts are the *inner* content only:

```html
<section id="experience" class="section" tabindex="-1" aria-labelledby="experience-title">
  <div class="container"><!-- PART:experience --></div>
</section>
```

IDs: `about`, `experience`, `research`, `education`, `contact`. Parts must use the matching `*-title` id on the section's `h2`.

Classes provided by T1 (in styles.css):

- `.container` — handoff §8.
- `.section-head` > `.eyebrow` (label text, body font 600, with blue wash) + `h2` + `p.lede`.
- `.wash` + `.wash--blue` | `.wash--sage`; tunable via `--wash-pos`, `--wash-size`, `--wash-opacity` (default .6). Wash is a `::before`, z-index -1, `isolation:isolate`.
- `.note` — Caveat, decorative; element must be `aria-hidden="true"`.
- `details.disclosure` > `summary.disclosure__summary` containing `.disclosure__heading` (wraps `h3.disclosure__title` + `p.disclosure__meta`), optional `p.disclosure__aside` (collapsed summary line), and `span.chevron` (aria-hidden; rotates on `[open]`); then `div.disclosure__body`. No borders. Summary ≥44px, full hit target, `:focus-visible` ring.
- `ul.checks > li` — each li starts with `<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>`.
- `.btn-primary`, `.link-wash` (short watercolor underline), `.icon`.
- SVG sprite ids: `i-check i-chevron i-arrow i-download i-doc i-cap i-mail i-linkedin i-github i-menu i-close i-external`.
- Colors only via tokens (`--ink --copy --route-blue --sky-wash --sage-wash --paper --focus`). Text sitting on a wash uses `--ink` unless `--wash-opacity` ≤ .55.

Part CSS: selectors prefixed `.xp-` (experience), `.rs-` (research), `.ed-` (education/skills), `.ct-` (contact). No global element selectors, no redefining tokens.

## T1 details
- `<head>`: lang en, charset, viewport, title/description/OG per spec, `favicon.svg`, preload `assets/fonts/bricolage-grotesque-latin-800-normal.woff2` and portrait-480.avif? (preload only the LCP portrait via `<link rel=preload as=image imagesrcset>`), link `assets/fonts/fonts.css` then `styles.css`, `main.js` `defer`.
- Header: sticky, paper bg, no border. Name left, nav links, "Build with evidence." `.note` on the right (desktop only). Active link: blue wash + navy dot, driven by `aria-current="location"`.
- Mobile (<768px): menu button (≥44px) opens `<dialog class="nav-sheet">` with `showModal()`, close button `aria-label="Close navigation"`. Link click → close + focus target section; Esc/close → focus trigger.
- Hero: script name note, H1 (clamp floor ~2.4rem), lede, availability list with doc/cap icons, CTA row: primary `View experience` → #experience, `View research` link-wash → #research, `Request tailored CV` link-wash with download icon → #contact. Portrait in `<picture>` (avif/webp/jpg, 480/960 srcset, width/height) with paper-frame treatment (no heavy shadow) and washes behind. On mobile availability precedes portrait.
- About: `.section-head` label "About"; first two About paragraphs of portfolio.md verbatim (bold preserved as `<strong>`); two proof points `3 years · analytics engineering`, `2 publications · accepted / under review`; `<details>` "Background & mobility" with the itinerary as a `<table>` (text only).
- Footer: name, links, © 2026.
- `main.js`: IntersectionObserver over sections → `aria-current` on desktop + dialog links; dialog handlers. No other JS.
- `_headers`: `/assets/fonts/*  Cache-Control: public, max-age=31536000, immutable`.

## T2 details
- Experience: head per handoff §5 (label, H2, lede). Three `details.disclosure` in order; Senior `open` with aside `US$43B AUM fund · 5 GB/day Databricks`; body = 2-col `.checks` evidence grid (the four handoff pairings, exact) + full bullets + "Selected engagements" table from portfolio.md. Junior/Ubisoft asides per handoff, bodies = portfolio.md bullets. On mobile the evidence grid is 2×2.
- Research: head with H2 "Research" (+ decorative `.note` "test, then trust."). CCU item `open` with sage wash: meta, title, method, `.checks` validation, results block labelled `mAP gain under corruption` (body font) with three figure tiles `PASCAL-C +7.16` etc. (no %), body detail: CCU university, NSTC/IIPP, family-wise error control, stock HF Transformers. Optional `research-illustration` (picture webp/png, lazy, `alt=""`) if it fits without outranking results. Two publication disclosures: summary shows venue · year, authorship · status, title; body shows full author list with Nhan in `<strong>`, affiliation, arXiv link (`arXiv:2608.26186`). Never "published".

## T3 details
- Education: head label "Education", H2 `Education & skills`. Three entries reverse-chronological: Erasmus Mundus MSc (Aug 2025 – Present, route detail inside a disclosure), VNUK Engineer degree (GPA 3.87/4.0 — Valedictorian visible), Erasmus+ Babeș-Bolyai (GPA 9.0/10). Skills: 6 handoff groups + Languages as text groups (dt/dd), no chips.
- Contact: head label "Contact", H2 `Request a tailored CV`, lede = the portfolio.md CV sentence verbatim. No invented claims. Email/LinkedIn/GitHub as plain links with icons. Three CV paths as `mailto:thanhnhannguyenld@gmail.com?subject=` with URL-encoded `CV request — Research / R&D` etc.; one gets `.btn-primary` (one primary per viewport), others `.link-wash`.

## Verification (T5) — screenshots, not code
Serve: `npx --yes serve site -l 4321`. Agent-browser named sessions (`nhan-desk`, `nhan-mob`, `nhan-a11y`).
- Desktop: 1440×992 per-section screenshots compared to the three desktop mockups; 1024 full page.
- Mobile: 390×844 and 320×568 full page; dialog open; after link tap (section in view, dialog closed); keyboard Tab/Enter/Space on a closed `<details>`; no horizontal overflow; availability visible in first viewport.
- Content/a11y: §12 checklist; text-grep checks (no "published", no `%` near mAP, 30M+ visible collapsed); axe-core injection; pixel-sample contrast for text on washes; tap targets ≥44px; `Đà Nẵng` and `Babeș` glyphs render in the right font (zoomed screenshot).
Each verifier reports: PASS/FAIL per item with screenshot path; FAILs with selector + suggested fix.
