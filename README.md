# Markus Edgar Hormeß — personal site

A static, responsive exhibition/workbench for books, communities, teaching, strategic prototypes, and AI experiments.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The build writes route-specific `index.html` copies so direct links work on GitHub Pages and Render Static Sites without a server-side router.

## Content model

`src/content.js` is the canonical registry for project identifiers, routes, formats, lenses, states, dates, source links, image descriptions, and credits. Do not introduce metadata directly in components.

## Release gate

A fresh-context reviewer—not the builder—must return at least 90/100 overall, every category at least 8/10, no critical issues, and no remaining must-fix findings. Review history lives beside the style bible in `../style-bible/reviews/`.

## Deployment targets

- Primary: [markusedgar.github.io](https://markusedgar.github.io/) from the generated `gh-pages` branch
- Compatible fallback: Render Static Site through `render.yaml`
