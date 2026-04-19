# ONQL Documentation

This folder is a [Docusaurus 3](https://docusaurus.io) site that powers the public ONQL docs.

## Run locally

```bash
cd docs
npm install
npm start
```

The dev server runs on `http://localhost:3000` with hot reload.

## Build for production

```bash
npm run build
```

Static output goes to `build/`. Drop it on any static host.

## Deploy

### GitHub Pages

```bash
GIT_USER=<your-github-username> npm run deploy
```

### Cloudflare Pages / Netlify / Vercel

Point at the repo, set:

- **Build command:** `npm run build`
- **Build output directory:** `build`
- **Base directory:** `docs`

## Folder structure

```
docs/
├── docs/                  ← markdown content (the actual docs)
│   ├── intro.md
│   ├── getting-started/
│   ├── tour/
│   ├── concepts/
│   │   ├── protocol/
│   │   ├── relationships/
│   │   └── query-execution/
│   ├── language/
│   │   ├── filters/
│   │   ├── projections/
│   │   └── aggregates/
│   ├── cookbook/
│   ├── reference/
│   ├── deployment/
│   └── contributing.md
├── sidebars.js            ← navigation tree
├── docusaurus.config.js   ← site config
├── src/
│   └── css/
│       └── custom.css     ← theme overrides
├── babel.config.js
├── package.json
└── README.md              ← you are here
```

## Contributing

See [`docs/contributing.md`](./docs/contributing.md) for the guide. TL;DR:

1. Find or create the right `.md` file.
2. Add it to `sidebars.js` if it's new.
3. Open a PR.

Every page has an "Edit this page" link that takes you straight to the file on GitHub for one-click typo fixes.
