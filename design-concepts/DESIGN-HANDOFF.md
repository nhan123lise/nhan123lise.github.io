# Norah Nguyen Portfolio — Design & Build Handoff

This document is the implementation authority for the portfolio design. Use
[`portfolio.md`](../portfolio.md) as the factual content source. The mockups are
visual references, not images to embed as whole pages.

## 1. Product goal

Build a professional, single-page portfolio for EU internship recruiters and
technical hiring managers. The page must communicate, in this order:

1. Norah's ML/analytics positioning.
2. Availability from February 2027.
3. UTC enrolment through August 2027 and an arrangeable French *convention de
   stage*.
4. Three years of demanding production analytics work.
5. Research depth, publications, and reproducibility standards.
6. A clear path to contact Norah or request a tailored CV.

The visual idea is **an evidence-led research notebook**: rigorous, calm, human,
and accountable. Watercolor provides warmth and grouping; typography and real
evidence provide authority.

## 2. Reference mockups

Use these as the canonical visual references:

| State | File | Purpose |
|---|---|---|
| Home, desktop | [`section-home.png`](./section-home.png) | Hero, navbar, availability, CTA hierarchy |
| Experience, desktop | [`section-experience-expanded.png`](./section-experience-expanded.png) | Active nav and borderless accordion states |
| Research, desktop | [`section-research-expanded.png`](./section-research-expanded.png) | Research evidence and publication rows |
| Experience, mobile | [`section-mobile-nav-experience.png`](./section-mobile-nav-experience.png) | Open navigation and responsive accordion |

Earlier `portfolio-desktop.png` and `portfolio-mobile.png` files are superseded
concepts. Do not use their compressed full-page layout.

## 3. Brand and uniqueness guardrails

### What makes the design specific to Norah

- The tension between soft, observational watercolor and hard technical proof.
- Evidence is a visual motif: methods, correctness gates, real scale, measured
  outcomes, and publication status.
- The page feels like an authored research notebook, not a dashboard or a CV
  pasted into cards.
- Blue and sage washes feel calm and analytical; deep navy type keeps the work
  authoritative.

### Non-negotiables

1. Content remains the hero; decoration never outranks evidence.
2. Watercolor is semantic: use it for active state, grouping, or emphasis—not
   behind every label.
3. Keep all meaningful content as selectable HTML text.
4. Use specific proof instead of vague "impact" language.
5. Keep one coherent ink/watercolor system across breakpoints.

### Avoid

- Black or gray card borders, hairline dividers, and box-heavy accordions.
- Generic SaaS cards, soft shadows, gradient blobs, neon, code rain, robots, or
  faux-terminal styling.
- Browser chrome inside the implemented site.
- Repeated watercolor pills at equal visual weight.
- Generic laptop/plant/chart art unless it explains the adjacent content.
- Handwriting for navigation, metadata, body copy, or essential facts.
- Large city/route illustrations; they consume space without helping recruiters.

## 4. Information architecture

The site is one scrolling page:

```text
Header / anchor navigation
Home / hero
About
Experience
Research
Education + skills
Contact / tailored CV
Footer
```

Desktop navigation order and section IDs:

```text
About      #about
Experience #experience
Research   #research
Education  #education
Contact    #contact
```

Critical information must be visible without expansion. Accordions reveal
supporting evidence; they do not hide the role, dates, strongest scale signal,
publication status, or authorship.

## 5. Visible content

### Home

- H1: `ML & analytics engineer for robust, measurable systems`
- Supporting copy: `Analytics engineer turned ML researcher, focused on systems
  that are measurable, reproducible, and useful in the real world.`
- Availability:
  - `Six-month EU internship · February 2027`
  - `UTC student through August 2027`
  - `French convention de stage can be arranged`
- Primary CTA: `View experience` → `#experience`
- Secondary CTA: `View research` → `#research`
- Tertiary CTA: `Request tailored CV` → `#contact`

### About

Keep this section short. Use the first two paragraphs of the About content in
`portfolio.md`, then show two general proof points:

- `3 years · analytics engineering`
- `2 publications · accepted / under review`

Optional disclosure: `Background & mobility` may expose the text-only itinerary.
Do not recreate the city illustrations.

### Experience

Intro:

- Label: `Experience`
- H2: `Three years of systems that had to ship — and be right.`
- Supporting copy: `From data pipelines to executive reporting, I built
  analytics systems for demanding teams and global clients.`

Use native disclosure rows in this order. Open Senior by default.

#### Senior Analytics Engineer

`FPT Software · Dec 2024 – Jul 2025`

Always-visible expanded evidence, preserving the pairings:

- `US$43B AUM fund · optimized SQL and data models`
- `Executive Power BI reporting · national and regional scale`
- `5 GB/day Databricks standardisation pipeline`
- `Global clients across US, EU & APAC`

Further details come from the matching role in `portfolio.md`. Do not bind the
US$43B figure to the executive-reporting claim; they are separate accomplishments.

#### Junior Analytics Engineer

`FPT Software · Mar 2023 – Dec 2024`

Collapsed summary: `Automated board-level fund reporting in SQL + Power BI`

#### Data Analyst Intern

`Ubisoft · Aug 2022 – Feb 2023`

Collapsed summary:
`30M+ active users across 13 games · Tableau, BigQuery + Firebase`

### Research

Open the CCU research item by default.

#### CCU research internship

- Meta: `CCU research internship · 2026`
- Title: `Robust open-vocabulary detection under corruption`
- Method: `Training-free test-time augmentation + Weighted Boxes Fusion on
  frozen Grounding DINO. No weight, gradient, or prompt changes.`
- Validation:
  - `Holm–Bonferroni screen → confirm protocol`
  - `bit-for-bit correctness gates`
- Results, labeled `mAP gain under corruption`:
  - `PASCAL-C · +7.16`
  - `COCO-C · +6.24`
  - `FoggyCityscapes · +5.42`

Expanded detail should also expose the university, NSTC/IIPP funding, family-wise
error control, and stock HuggingFace Transformers comparison from `portfolio.md`.

#### Publication disclosures

1. `SmartAgri & SuSY · 2026 · First author · accepted`
   - `Deep Imputation Does Not Pay Off on Agricultural IoT Networks: A
     Rate-Swept Benchmark`
2. `Language Resources & Evaluation · Co-first author · arXiv · under review`
   - `Investigating the Influence of Prompt and Response Languages on LLM
     Content Generation`

Expanded publication details must include exact authorship and the arXiv link
from `portfolio.md`.

Never call either paper "published." Do not add `%` to the mAP gains.

### Education and skills

Show the three education entries from `portfolio.md` in reverse chronological
order. Keep degree, institution, date, GPA, and Valedictorian status visible;
place semester/mobility detail inside disclosure content.

Follow with compact skill groups using the existing categories:

- ML & Research
- Data Engineering
- Visualization / BI
- Cloud & Tools
- Research Areas
- Programming

Do not render every skill as a bordered chip. Use text groups with whitespace and
occasional watercolor emphasis.

### Contact

Expose email, LinkedIn, and GitHub as normal links. Offer three tailored CV paths:

- Research / R&D
- Data / Analytics Engineering
- General / ML Engineer

## 6. Visual tokens

Use these values as the starting implementation tokens:

```css
:root {
  --paper: #fcfcfa;
  --ink: #10183f;
  --copy: #4d6985;
  --route-blue: #3f7089;
  --sky-wash: #ddeef5;
  --sage-wash: #eaf2dd;
  --focus: #0b57d0;

  --font-display: "Bricolage Grotesque", system-ui, sans-serif;
  --font-body: "Source Sans 3", system-ui, sans-serif;
  --font-note: "Caveat", cursive;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  --content-max: 93.75rem;
  --header-height: 5rem;
}
```

Typography guidance:

```css
h1 { font-size: clamp(3rem, 5.4vw, 5.5rem); line-height: 0.98; }
h2 { font-size: clamp(2.75rem, 4.5vw, 4.5rem); line-height: 1; }
h3 { font-size: clamp(1.5rem, 2.2vw, 2.1rem); line-height: 1.1; }
.lede { font-size: clamp(1.125rem, 1.7vw, 1.75rem); line-height: 1.45; }
body { font-size: 1rem; line-height: 1.65; }
```

- Use display weight 700–800 and body weight 400–500.
- Keep body lines below roughly 75 characters.
- `--font-note` is decorative and optional. Never use it for essential content.
- Self-host font files if available and licensed; otherwise load only the weights
  actually used.

## 7. Watercolor and illustration assets

| Asset | Dimensions | Alpha | Use |
|---|---:|---:|---|
| [`../ProfilePicture.jpg`](../ProfilePicture.jpg) | 960×958 | No | Portrait source; preserve identity |
| [`research-hero-transparent.png`](./research-hero-transparent.png) | 1774×887 | Yes | Optional data/research process illustration |
| [`watercolor-wash-blue.png`](./watercolor-wash-blue.png) | 2172×724 | Yes | Active nav, section title, primary grouping |
| [`watercolor-wash-sage.png`](./watercolor-wash-sage.png) | 2172×724 | Yes | Secondary grouping or evidence background |
| [`../Reference-vibe.PNG`](../Reference-vibe.PNG) | 896×1195 | No | Style reference only; do not ship by default |

Implementation rules:

- Use the wash PNGs through pseudo-elements so the text remains selectable.
- Vary crop and scale; do not repeat an identical swash behind every item.
- Keep opacity restrained and verify text contrast on the final composite.
- Decorative images use empty alt text and `aria-hidden="true"` where applicable.
- Give the portrait descriptive alt text.
- Export responsive AVIF/WebP versions of the portrait and large illustration,
  retaining the originals as fallbacks.

Example wash treatment:

```css
.wash {
  position: relative;
  isolation: isolate;
}

.wash::before {
  content: "";
  position: absolute;
  inset: -20% -4%;
  z-index: -1;
  background: var(--wash-image) center / 100% 100% no-repeat;
  opacity: 0.78;
  pointer-events: none;
}
```

## 8. Layout and responsive behavior

Use one centered container:

```css
.container {
  width: min(100% - 3rem, var(--content-max));
  margin-inline: auto;
}

section { scroll-margin-top: calc(var(--header-height) + 1.5rem); }
```

| Width | Behavior |
|---|---|
| `>= 1024px` | Horizontal nav; two-column hero; Experience evidence in two columns; Research text/results split |
| `768–1023px` | Reduce gutters; allow grids to stack when their content needs it; never wrap the nav awkwardly |
| `< 768px` | Mobile menu; one-column sections; 24px gutters; Experience evidence in a 2×2 grid |
| `< 420px` | Natural title wrapping; minimum 16px body text; minimum 44×44px targets |

Use `clamp()` and intrinsic CSS grid before adding extra breakpoints.

## 9. Components and interactions

### Header and section navigation

- Sticky paper-colored header with no bottom border.
- Desktop anchor links scroll to the matching IDs.
- Active section uses the blue wash asset plus a small navy dot. The dot prevents
  the state from relying on color alone.
- Use a small `IntersectionObserver` to update `aria-current="location"`.
- Add a skip link before the header.

### Mobile navigation

- Use a native `<dialog>` opened with `showModal()`.
- Provide a visible close button with `aria-label="Close navigation"`.
- Close after an anchor is selected; Escape should close it; restore focus to the
  trigger.
- Suggested width: `min(88vw, 28.75rem)`.
- Use a paper/watercolor sheet with no gray outline or shadow-heavy card styling.

### Expandable content

Use native `<details>` and `<summary>`:

```html
<details open>
  <summary>
    <span>Senior Analytics Engineer</span>
    <span>FPT Software · Dec 2024 – Jul 2025</span>
    <span aria-hidden="true" class="chevron"></span>
  </summary>
  <!-- evidence grid -->
</details>
```

- The entire summary is the hit target.
- Chevron points down when closed and up when open.
- Do not add custom accordion JavaScript or enforce one-open-at-a-time behavior.
- Use whitespace and watercolor backgrounds for separation; no rectangular
  borders or long gray rules.

### CTA hierarchy

- One primary CTA per viewport: route-blue fill, no border.
- Secondary and tertiary actions are text links with a short watercolor underline.
- Provide distinct hover, active, and high-contrast `:focus-visible` states.
- Do not give all actions equal visual weight.

## 10. Accessibility

- Use semantic `header`, `nav`, `main`, `section`, `footer`, one `h1`, section
  `h2`s, and item `h3`s.
- All controls must work with mouse, touch, Enter, and Space.
- Minimum target size: 44×44px.
- Verify WCAG AA contrast, especially blue copy over blue/green washes.
- Do not put essential text inside raster images.
- Decorative watercolor, checkmarks, arrows, and doodles use empty alt text.
- Respect `prefers-reduced-motion`; no animated watercolor movement.
- Keep keyboard focus visible and independent of watercolor decoration.

## 11. Performance and implementation scope

The simplest correct build is a static one-page site using semantic HTML, CSS,
and a small JavaScript file for active-section state and the dialog menu. Do not
add a framework unless the repository already requires one.

- Lazy-load below-the-fold images.
- Set explicit image dimensions to avoid layout shift.
- Generate AVIF/WebP variants during the build.
- Preload only the portrait or the actual largest-contentful image.
- Do not ship mockup screenshots, `Reference-vibe.PNG`, or unused earlier concepts.
- Do not add animation libraries; CSS is sufficient for small state transitions.

## 12. Acceptance checklist

- [ ] Page order is Home → About → Experience → Research → Education/Skills → Contact.
- [ ] Availability, UTC enrolment, and convention information are visible above the fold.
- [ ] Navbar anchors land correctly and the active state updates while scrolling.
- [ ] Mobile navigation is a keyboard-operable modal dialog.
- [ ] Experience and Research use native, keyboard-operable disclosures.
- [ ] Senior FPT and CCU research are open by default.
- [ ] Metric-to-claim pairings match this handoff and `portfolio.md`.
- [ ] Publication status and authorship remain visible while collapsed.
- [ ] Ubisoft's 30M+ / 13 games scale remains visible while collapsed.
- [ ] No city illustrations, box borders, gray rules, or browser chrome return.
- [ ] Watercolor groups content without becoming repeated wallpaper.
- [ ] Desktop and mobile share the same typography, nav state, and chevron language.
- [ ] All meaningful text is selectable HTML and passes contrast checks.
- [ ] Portrait identity is preserved and all images have correct alt behavior.
- [ ] Layout works at 320px, 768px, 1024px, and 1440px without clipping.
