---
id: contributing
title: Contributing to the Docs
sidebar_position: 99
---

# Contributing to the Docs

These docs are open source. Edits are welcome — typos, clarifications, new cookbook recipes, anything.

## Quick edits

Every page has an **"Edit this page"** link at the bottom that takes you straight to the file on GitHub. For small fixes, use the GitHub web editor and open a pull request.

## Local development

```bash
git clone https://github.com/ONQL/server
cd server/docs
npm install
npm start
```

The dev server runs on `http://localhost:3000` and reloads on every save.

## Structure

```
docs/
├── docs/             ← all the markdown content
│   ├── intro.md
│   ├── getting-started/
│   ├── tour/
│   ├── concepts/
│   ├── language/
│   ├── cookbook/
│   ├── reference/
│   └── deployment/
├── sidebars.js       ← navigation tree
├── docusaurus.config.js
├── src/css/custom.css
└── package.json
```

## Adding a new page

1. Create a new `.md` file under the right section.
2. Add a frontmatter block at the top:

   ```md
   ---
   id: my-new-page
   title: My New Page
   sidebar_position: 5
   ---
   ```

3. Add the file's id (path without `.md`) to the matching list in `sidebars.js`.
4. Run `npm start` and verify it shows up in the sidebar.

## Adding a new section

1. Create a new folder under `docs/docs/`.
2. Add a `_category_.json` if you want a custom label:

   ```json
   { "label": "My Section", "position": 6 }
   ```

3. Add a new entry to `sidebars.js` of `type: 'category'` pointing at the folder.

## Style

- **Active voice.** "ONQL fetches the rows" not "The rows are fetched by ONQL."
- **Examples first, prose second.** Most readers skim for the code block.
- **Tight tables** beat long bullet lists.
- **Avoid marketing.** Tell the truth about what works and what doesn't.

## Build & deploy

```bash
npm run build
```

Produces a static site under `build/`. Deploy to any static host:

- **GitHub Pages:** `npm run deploy`
- **Cloudflare Pages:** point at the repo, set the build command to `npm run build`, output dir to `build`.
- **Netlify / Vercel:** same idea.
