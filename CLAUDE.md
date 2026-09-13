# CLAUDE.md

Single-page portfolio for Nguyen Thi Thanh Nhan (Norah Nguyen), aimed at EU internship recruiters.

## Sources of truth

- `portfolio.md` — all facts. Never invent or reword claims; metric↔claim pairings matter.
- `design-concepts/DESIGN-HANDOFF.md` — visual, interaction, accessibility rules and the
  acceptance checklist (§12). Canonical mockups: `section-home.png`,
  `section-experience-expanded.png`, `section-research-expanded.png`,
  `section-mobile-nav-experience.png`. `portfolio-desktop.png` / `portfolio-mobile.png` are superseded.
- `docs/superpowers/specs/` — build/ship decisions.

## Stack

Plain static site, no framework, no build step. Everything that ships lives in `site/`:
`index.html`, `styles.css`, `main.js`, `assets/`. Repo-root images and `design-concepts/` are
references only and must never be copied into `site/` wholesale.

## Commands

```sh
npx serve site -l 4321                       # local preview
npx sharp-cli -i ProfilePicture.jpg -o site/assets/ -f avif resize 480   # regenerate an image variant
netlify deploy --dir site          # draft deploy (verify on the draft URL)
netlify deploy --dir site --prod   # production — personal Netlify account, NOT the wrangler/Cloudflare
                                   # login on this machine (that one is an employer account)
```

## Content rules that are easy to break

- Never call either paper "published": one is *accepted*, one is *under review*.
- mAP gains are `+7.16 / +6.24 / +5.42` with no `%`.
- US$43B belongs to "optimized SQL and data models", not to executive reporting.
- Confirmed facts (2026-09-13): Ubisoft figure is 30M+ **monthly** active users; 4 countries
  studied & lived; mAP gains are **absolute points**; SmartAgri & SuSY is a **conference**;
  the research area is Test-Time **Augmentation** (not Adaptation).
- Senior FPT and CCU research disclosures are `open` by default; publication status, authorship,
  and Ubisoft's 30M+ / 13 games stay visible while collapsed.

## Verification

Verify visually: screenshot at 1440 / 1024 / 768 / 390 / 320 px with `agent-browser` and
compare against the mockups, plus keyboard checks for the nav dialog and `<details>`.

Automated gate before every merge: `npx --yes -p playwright@1.55.1 node scripts/check.mjs [baseUrl]`
(3 engines × 5 viewports; exit 1 on any FAIL; screenshots to `$TMPDIR/portfolio-check`).

## Git

No `Co-Authored-By` trailers in commits.
