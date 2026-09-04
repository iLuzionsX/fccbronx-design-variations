# FCC Bronx — three design directions

Three complete homepage variations for [Fordham Community Church](https://fccbronx.org) (Bronx, NY), designed in the visual language of Virgil Abloh — grotesk type at billboard scale, quotation-mark labels, industrial metadata — and drawn in the church's own hand: navy ink on cream paper, hand-drawn line illustrations, the FCC mark, and the church's own photography.

**Live preview:** https://iluzionsx.github.io/fccbronx-design-variations/variations/ — the repo root is the published React site (built by the Pages workflow); these static variations live in `public/variations/` so Vite copies them verbatim into the deploy.

Open `index.html` to pick a variation, or jump straight in:

| | Variation | Mood | Palette |
|---|---|---|---|
| V1 | [`v1-off-white/`](./v1-off-white/index.html) — **"Off-White"** | Loud, warm, poster-like | Cream paper · navy ink · line-art values, skyline |
| V2 | [`v2-safety-orange/`](./v2-safety-orange/index.html) — **"Ink"** | Industrial, nocturnal | Navy-ink ground · cream line art · brass index numbers · cream duotone photos |
| V3 | [`v3-figures-of-speech/`](./v3-figures-of-speech/index.html) — **"Figures of Speech"** | Museum catalogue, quiet | Paper · ink · rubric-red numbering · numbered plates and footnotes |

Every variation carries the same content, sourced from the current site: vision and values (Know / Live / Love), Sunday service times (9:45 AM Español, 11:45 AM English), address and transit, recent sermon series, connect pathways, FCC Kids, the leadership team, and the Building Campaign. Navigation is always visible on every screen size (it wraps rather than collapsing behind a menu button). A floating switcher in the bottom-right corner lets you hop between variations while reviewing.

## Running it

It is plain HTML and CSS with a small progressive-enhancement script; there is no build step.

```bash
# any static server works
python3 -m http.server 8080
# then open http://localhost:8080/public/variations/
```

Serve it over HTTP rather than opening the files directly: the line illustrations are referenced from a shared SVG sprite (`<use href="../shared/illustrations.svg#dove">`), which browsers block on `file://` URLs.

## Structure

```
public/variations/
  index.html                    landing page / variation picker
  shared/
    base.css                    reset, paper/ink tokens, grain overlay, utilities, reveal + marquee, reduced-motion handling
    illustrations.svg           line-art sprite: FCC mark, dove, skyline, branch, frond, tree, cup, bread, tomb, crosses, flowers, fruit, notes, train
    site.js                     scroll reveal, marquee cloning, current year
  v1-off-white/                 index.html + style.css
  v2-safety-orange/             index.html + style.css
  v3-figures-of-speech/         index.html + style.css
```

Each variation is self-contained: its `style.css` only overrides the design tokens and adds its own layout. Swapping the accent color, type scale, or line color for a variation is a one-line change at the top of its stylesheet.

## The FCC mark and illustrations

The logo (navy disc, diamond, three pillars) is redrawn as two SVG symbols in `shared/illustrations.svg`: `#mark-solid` (filled disc, for headers) and `#mark` (outline, for footers and labels). Both inherit `currentColor`, so the same symbol prints navy-on-cream or cream-on-navy depending on context. The rest of the sprite is a set of single-weight line drawings in the style of the mural on the church's wall — dove, Bronx skyline, olive branch, palm frond, tree, cup and bread, tomb and three crosses, flowers, fruit, music notes, the 4 train — used as section marks and value illustrations.

## Fonts

Display type is Inter Tight (a tight grotesk in the Helvetica tradition Abloh worked in); body copy asks for `"Helvetica Neue", Helvetica` first and falls back to Inter. Caveat supplies the hand-lettered script for the "know / live / love" refrain, and JetBrains Mono the industrial metadata labels. All are loaded from Google Fonts; to self-host, replace the `<link>` tags in each `index.html` with `@font-face` rules.

## Accessibility

Semantic landmarks, a skip link, descriptive `alt` text on every photograph, decorative illustrations hidden from assistive tech, visible focus rings, always-visible navigation (no hidden menu to discover), and full `prefers-reduced-motion` support (scroll reveals, the marquee, and hover transitions are all disabled).

## Photography

All photographs are from the current fccbronx.org site and remain the property of Fordham Community Church. They are loaded directly from the church's existing Squarespace CDN (`images.squarespace-cdn.com`), so this repo contains no image binaries; when the chosen direction goes to production, download them into an `assets/img/` folder and point the `src` attributes there. The team portraits are mapped to names in the same order the current Team page presents them; please confirm before publishing.

## Going to production

Pick a direction, then:

1. Move the remaining pages (What We Believe, City Link Groups, Contact, Building Campaign) into the chosen variation using the same section patterns.
2. Replace the outbound `fccbronx.org/...` links with local routes.
3. Remove the `.variant-switch` block from the HTML and `base.css`.
4. Wire the sermon cards to the YouTube playlist or a podcast feed.
