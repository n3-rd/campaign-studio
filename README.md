# Campaign Studio

A tiny, open-source, anti-slop social media campaign & carousel designer.

No accounts, no backend, no Figma bloat — pick an editorial layout, drop in your logo and copy, and export crisp **2x retina PNGs** right in your browser.

## Why?

Most social graphic tools push noisy gradients, stock clipart, and cluttered templates. **Campaign Studio** gives founders, indie hackers, and small teams a dead-simple set of high-contrast editorial layouts that actually stop the scroll on X, LinkedIn, Instagram, and Product Hunt.

## Features

- **5 Minimal Layouts**:
  - **Bold Statement** — Editorial hook / PSA with optional status badge and icon row
  - **Launch Poster** — Full-bleed accent poster with brand header and feature pills
  - **Before / After** — Clean side-by-side or stacked comparison cards
  - **Receipt / Pricing** — Split headline + crisp paper invoice comparison
  - **Routing / Stack** — Highlight one input fanning out to multiple apps/channels
- **3 Curated Themes**: `Obsidian Dark`, `Warm Paper`, and `Acid Lime` (plus custom accent colors)
- **3 Export Formats**: `Square (1080×1080)`, `Wide (1200×675)`, and `Carousel (1080×1350)`
- **Multi-Slide Carousels**: Add/reorder slides with automatic `01 / 04` numbering and 1-click export
- **Inline Accent Highlight**: Wrap any phrase in `*asterisks*` in your headline to highlight it in your brand accent
- **100% Client-Side**: Embedded `Outfit` + `JetBrains Mono` fonts, instant 2x PNG download or clipboard copy

## Quick Start

```bash
bun install
bun run dev
```

Build static bundle for Cloudflare Pages, Vercel, Netlify, or GitHub Pages:

```bash
bun run build
# outputs to ./dist
```

## License

MIT — built by [Automasend](https://automasend.com).

