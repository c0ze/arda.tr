# arda.tr

Personal portfolio site for Arda Karaduman.

## Stack

- Vite 5
- React 18
- TypeScript
- Tailwind CSS
- npm only

## Requirements

- Node.js `24.x`
- npm `11.x`

The repo is configured for:

```sh
node -v
# v24.x

npm -v
# 11.x
```

## Commands

```sh
npm ci
npm run dev
npm run verify
npm run build
npm run preview
```

## Project Layout

```text
config/    build, lint, tailwind, and site config
public/    static assets, including og-image.png
scripts/   build-time helpers such as sitemap generation
src/       app code and UI
```

## SEO Notes

- `public/og-image.png` is the social preview image.
- `scripts/generate-sitemap.mjs` generates `dist/sitemap.xml` on every build.
- `config/site.config.json` is the canonical source for site URL, themes, and indexed pages.

## Deployment

GitHub Actions builds and deploys the site to GitHub Pages on pushes to `main`.
