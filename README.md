# FCC Bronx — three design directions

Three complete homepage variations for [Fordham Community Church](https://fccbronx.org) (Bronx, NY), designed in the visual language of Virgil Abloh: Helvetica-style grotesk at billboard scale, quotation-mark labels, industrial metadata, a single accent color, and the church's own photography.

**Live preview:** https://iluzionsx.github.io/fccbronx-design-variations/ — served by GitHub Pages from the `main` branch (Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`).

Open `index.html` to pick a variation, or jump straight in:

| | Variation | Mood | Palette |
|---|---|---|---|
| V1 | [`v1-off-white/`](./v1-off-white/index.html) — **"Off-White"** | Loud, warm, poster-like | White · black · one orange zip-tie |
| V2 | [`v2-safety-orange/`](./v2-safety-orange/index.html) — **"Safety Orange"** | Industrial, nocturnal | Near-black · safety orange · orange duotone photos |
| V3 | [`v3-figures-of-speech/`](./v3-figures-of-speech/index.html) — **"Figures of Speech"** | Museum catalogue, quiet | Paper · cobalt · numbered plates and footnotes |

Every variation carries the same content, sourced from the current site: vision and values (Know / Live / Love), Sunday service times (9:45 AM Español, 11:45 AM English), address and transit, recent sermon series, connect pathways, FCC Kids, the leadership team, and the Building Campaign. A floating switcher in the bottom-right corner lets you hop between variations while reviewing.

## Running it

It is plain HTML and CSS with a small progressive-enhancement script; there is no build step.

```bash
# any static server works
python3 -m http.server 8080
# then open http://localhost:8080/
```

Opening `index.html` directly from the filesystem also works.

## Structure

```
index.html                      landing page / variation picker
shared/
  base.css                      reset, tokens, utilities, reveal + marquee, reduced-motion handling
  site.js                       mobile nav, scroll reveal, marquee cloning, current year
v1-off-white/                   index.html + style.css
v2-safety-orange/               index.html + style.css
v3-figures-of-speech/           index.html + style.css
```

Each variation is self-contained: its `style.css` only overrides the design tokens and adds its own layout. Swapping the accent color, type scale, or line color for a variation is a one-line change at the top of its stylesheet.

## Fonts

Abloh's work is set in Helvetica. The stylesheets ask for `"Helvetica Neue", Helvetica` first and fall back to Inter (loaded from Google Fonts) so the design holds on machines without Helvetica. JetBrains Mono is used for the industrial metadata labels. If you want to self-host, replace the `<link>` tags in each `index.html` with `@font-face` rules.

## Accessibility

Semantic landmarks, a skip link, descriptive `alt` text on every photograph, visible focus rings, keyboard-operable mobile navigation with `aria-expanded`, and full `prefers-reduced-motion` support (scroll reveals, the marquee, and hover transitions are all disabled).

## Photography

All photographs are from the current fccbronx.org site and remain the property of Fordham Community Church. They are loaded directly from the church's existing Squarespace CDN (`images.squarespace-cdn.com`), so this repo contains no image binaries; when the chosen direction goes to production, download them into an `assets/img/` folder and point the `src` attributes there. The team portraits are mapped to names in the same order the current Team page presents them; please confirm before publishing.

## Going to production

Pick a direction, then:

1. Move the remaining pages (What We Believe, City Link Groups, Contact, Building Campaign) into the chosen variation using the same section patterns.
2. Replace the outbound `fccbronx.org/...` links with local routes.
3. Remove the `.variant-switch` block from the HTML and `base.css`.
4. Wire the sermon cards to the YouTube playlist or a podcast feed.
