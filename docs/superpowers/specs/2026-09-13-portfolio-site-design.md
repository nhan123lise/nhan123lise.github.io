# Portfolio site — build & ship design

Authority: `design-concepts/DESIGN-HANDOFF.md` (visual/interaction/a11y rules) and
`portfolio.md` (facts). This spec only decides *how it is built and shipped*.

## Decisions

| Fork | Choice | Rejected | Why |
|---|---|---|---|
| Framework | Plain static `index.html` + `styles.css` + `main.js` | Astro, 11ty, Next | Handoff §11 forbids a framework unless required; one page, two JS behaviours (active nav, `<dialog>` menu). No build = nothing to break. |
| Image variants | Generated once with `npx sharp-cli`, committed to `site/assets/` | Build-time pipeline | Assets change ~never; a build step for 3 images is overhead. |
| Fonts | Self-hosted woff2 (Bricolage Grotesque 700/800, Source Sans 3 400/600, Caveat 500), latin + latin-ext + vietnamese subsets as needed | Google Fonts CDN | EU audience (GDPR rulings on Google Fonts); fewer origins. |
| Hosting | GitHub Pages on Nhan's `nhan123lise.github.io` repo, Actions workflow uploads `site/` only | Netlify (personal), Cloudflare Pages | Revised 2026-09-13: Nhan owns the repo and the github.io URL, which closes the custody follow-up. wrangler is an employer account. Needs the repo public (or a paid plan) and Pages source = GitHub Actions. |
| Deploy root | `site/` only | repo root | Guarantees mockups, `Reference-vibe.PNG`, docs never ship (handoff §11). |

## Layout

```text
site/
  index.html        all content as semantic HTML (header, main>section#about…#contact, footer)
  styles.css        tokens from handoff §6, layout §8, components §9
  main.js           IntersectionObserver → aria-current; dialog open/close/focus restore
  assets/           portrait (avif/webp/jpg, 480+960w), washes (webp+png), research illustration, fonts/
  favicon.svg
```

## Decorative layer

- Caveat is used ONLY for decorative flourishes ("Build with evidence.", "test, then trust.",
  script name/section tags), always `aria-hidden="true"`, always duplicated by real text.
  Essential labels (e.g. `mAP gain under corruption`) are body font (handoff §6 "never").
- Icons (document, mortarboard, check, chevron, arrow, download) are inline SVG, stroke = `--ink`.
- Where handoff and mockups disagree, the handoff text wins (e.g. Experience H2 wording, no
  laptop/plant spot art, no polaroid shadow card).

## Review-driven rules

- Contrast: `--copy` fails AA over dense wash pigment (measured 3.5–4.4:1 at 0.78 opacity).
  Text sitting on a wash uses `--ink`, or the wash opacity is ≤0.55 behind `--copy`.
  Verified by sampling screenshot pixels, since axe reports background-image contrast as incomplete.
- Senior FPT `<summary>` carries a one-line scale signal (`US$43B AUM fund · 5 GB/day Databricks`)
  so collapsing it never hides the strongest evidence (handoff §4).
- Mobile nav: Escape/close button → focus returns to trigger; choosing an anchor → focus moves to
  the target section (`tabindex="-1"`).
- `<head>`: `lang="en"`, title `Norah Nguyen (Nguyen Thi Thanh Nhan) — ML & Analytics Engineer`,
  meta description, OG title/description/image (portrait), favicon.
- H1 clamp floor lowered (~2.4rem) so `measurable,` fits 320px; on mobile the availability list
  precedes the portrait so it stays above the fold.
- Languages (from `portfolio.md`) are added as a seventh text group under skills.
- Research illustration ships as webp + png fallback (width 900), below the fold, lazy.
- Washes: the two PNGs via `::before` with varied `background-size/position` per use.
- No laptop/plant raster art (not supplied as assets; handoff says avoid generic art).
  `research-hero-transparent.png` may be used once, in Research, if it doesn't outrank results.

## CV requests

No files exist. Each CV path is a `mailto:` with a prefilled subject
(`CV request — Research / R&D`, etc.). No form backend.

## Verification (definition of done)

Screenshot-based, not code-reading:
1. Serve `site/` locally, capture 1440, 1024, 768, 390, 320 widths with agent-browser.
2. Compare desktop captures against `section-home.png`, `section-experience-expanded.png`,
   `section-research-expanded.png`; mobile against `section-mobile-nav-experience.png`.
3. Interaction captures: nav active state after scrolling to each section, mobile dialog open,
   a closed accordion opened by keyboard, focus ring visible.
4. Run the handoff §12 checklist against captures + axe/Lighthouse a11y score.
5. Repeat 1 & 3 against the Netlify draft URL, then promote with `--prod` and smoke-check the prod URL
   (`/Reference-vibe.PNG` and `/design-concepts/` must 404).

## Out of scope

Analytics, contact form, blog, i18n, dark mode (handoff defines a single paper palette), CMS.
