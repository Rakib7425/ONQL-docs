#!/usr/bin/env node
// Pulls every ONQL/onqlclient-* repo README from GitHub and writes one
// doc page per driver into docs/drivers/. Runs before `docusaurus start`
// and `docusaurus build` so the generated pages are always in sync with
// whatever drivers exist in the org right now.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(REPO_ROOT, 'docs', 'drivers');

const ORG = 'ONQL';
const REPO_PREFIX = 'onqlclient-';

// Pretty labels for known suffixes. Anything not in the map is title-cased.
const LABELS = {
  go: 'Go',
  node: 'Node.js',
  python: 'Python',
  php: 'PHP',
  java: 'Java',
  csharp: 'C#',
  c: 'C',
  cpp: 'C++',
  ruby: 'Ruby',
  rust: 'Rust',
};

// Order drivers appear in the sidebar. Anything not listed sorts alphabetically after.
const ORDER = ['python', 'node', 'go', 'java', 'csharp', 'php', 'ruby', 'rust', 'c', 'cpp'];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GT_TOKEN;

const ghHeaders = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'onql-docs-fetch-drivers',
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

async function ghJson(url) {
  const res = await fetch(url, { headers: ghHeaders });
  if (!res.ok) {
    throw new Error(`GitHub ${res.status} ${res.statusText} for ${url}`);
  }
  return res.json();
}

async function ghText(url) {
  const res = await fetch(url, { headers: { ...ghHeaders, Accept: 'application/vnd.github.raw' } });
  if (!res.ok) {
    throw new Error(`GitHub ${res.status} ${res.statusText} for ${url}`);
  }
  return res.text();
}

function prettyLabel(suffix) {
  if (LABELS[suffix]) return LABELS[suffix];
  return suffix.charAt(0).toUpperCase() + suffix.slice(1);
}

function stripFrontmatter(md) {
  if (!md.startsWith('---')) return md;
  const end = md.indexOf('\n---', 3);
  if (end === -1) return md;
  return md.slice(end + 4).replace(/^\s*\n/, '');
}

// Rewrite relative links/images in the README to absolute GitHub URLs so
// they resolve on the docs site instead of 404ing.
function absolutizeLinks(md, repoName, branch) {
  const rawBase = `https://raw.githubusercontent.com/${ORG}/${repoName}/${branch}`;
  const blobBase = `https://github.com/${ORG}/${repoName}/blob/${branch}`;

  // ![alt](./foo.png) or ![alt](foo.png) — images → raw
  md = md.replace(/(!\[[^\]]*\]\()(?!https?:|#|mailto:|data:)([^)\s]+)(\))/g, (_, a, url, c) => {
    const clean = url.replace(/^\.\//, '');
    return `${a}${rawBase}/${clean}${c}`;
  });

  // [text](./path) — non-image links → blob
  md = md.replace(/(^|[^!])(\[[^\]]+\]\()(?!https?:|#|mailto:)([^)\s]+)(\))/g, (_, pre, a, url, c) => {
    const clean = url.replace(/^\.\//, '');
    return `${pre}${a}${blobBase}/${clean}${c}`;
  });

  return md;
}

// Escape MDX-hostile chars that can appear in README prose. Drivers are
// written as .md so Docusaurus parses them as CommonMark (per markdown.format:
// 'detect'), but we belt-and-brace a few known footguns anyway.
function sanitize(md) {
  return md;
}

function frontmatter({ id, title, description, sidebarPosition, repoUrl }) {
  const esc = (s) => String(s).replace(/"/g, '\\"');
  const lines = [
    '---',
    `id: ${id}`,
    `title: "${esc(title)}"`,
    description ? `description: "${esc(description)}"` : null,
    `sidebar_position: ${sidebarPosition}`,
    `custom_edit_url: ${repoUrl}/edit/HEAD/README.md`,
    '---',
    '',
  ].filter(Boolean);
  return lines.join('\n');
}

async function main() {
  console.log(`[drivers] fetching ${ORG} repos…`);
  const repos = await ghJson(`https://api.github.com/orgs/${ORG}/repos?per_page=100`);
  const drivers = repos
    .filter((r) => !r.archived && !r.private && r.name.startsWith(REPO_PREFIX))
    .map((r) => ({
      suffix: r.name.slice(REPO_PREFIX.length),
      name: r.name,
      branch: r.default_branch || 'main',
      description: r.description || '',
      htmlUrl: r.html_url,
      stars: r.stargazers_count || 0,
      language: r.language || '',
      updatedAt: r.pushed_at || r.updated_at,
    }))
    .sort((a, b) => {
      const ai = ORDER.indexOf(a.suffix);
      const bi = ORDER.indexOf(b.suffix);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.suffix.localeCompare(b.suffix);
    });

  if (drivers.length === 0) {
    throw new Error('No onqlclient-* repos found. Has the org name changed?');
  }

  console.log(`[drivers] found ${drivers.length}: ${drivers.map((d) => d.suffix).join(', ')}`);

  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  // Category metadata so Docusaurus auto-generates the sidebar entry nicely.
  await fs.writeFile(
    path.join(OUT_DIR, '_category_.json'),
    JSON.stringify(
      {
        label: 'Drivers',
        position: 5,
        collapsible: true,
        collapsed: false,
        link: { type: 'generated-index', slug: '/drivers', title: 'Client Drivers' },
      },
      null,
      2,
    ) + '\n',
  );

  // Index / overview page for the section.
  const indexRows = drivers
    .map((d) => {
      const label = prettyLabel(d.suffix);
      const desc = d.description || '—';
      return `| [${label}](./${d.suffix}.md) | \`${d.name}\` | ${desc} | [GitHub](${d.htmlUrl}) |`;
    })
    .join('\n');

  const indexMd = `---
id: index
title: Client Drivers
sidebar_position: 0
description: Official ONQL client libraries, one per language.
slug: /drivers/overview
---

# Client Drivers

ONQL speaks a simple JSON-over-TCP protocol delimited by \`\\x04\` (EOT).
Any language with a TCP socket can talk to it — these are the official
drivers we ship. Each page below mirrors the current \`README.md\` of
its repository.

| Language | Repo | Description | Source |
|---|---|---|---|
${indexRows}

Missing a language? The [protocol spec](https://github.com/ONQL/server/blob/main/MESSAGE_PROTOCOL.md)
is short — open a PR or start a new \`onqlclient-<lang>\` repo in the org
and it will show up here on the next build.
`;
  await fs.writeFile(path.join(OUT_DIR, 'index.md'), indexMd);

  // One page per driver.
  for (let i = 0; i < drivers.length; i++) {
    const d = drivers[i];
    const label = prettyLabel(d.suffix);
    console.log(`[drivers] ${d.name} → drivers/${d.suffix}.md`);

    let readme;
    try {
      readme = await ghText(`https://api.github.com/repos/${ORG}/${d.name}/readme`);
    } catch (err) {
      console.warn(`[drivers] ${d.name}: no README (${err.message}) — stub page`);
      readme = `_No README published yet._\n\nSee the repository on [GitHub](${d.htmlUrl}).\n`;
    }

    readme = stripFrontmatter(readme);
    readme = absolutizeLinks(readme, d.name, d.branch);
    readme = sanitize(readme);

    const body =
      frontmatter({
        id: d.suffix,
        title: `${label} driver`,
        description: d.description || `Official ONQL client for ${label}.`,
        sidebarPosition: i + 1,
        repoUrl: d.htmlUrl,
      }) +
      `\n:::info Live mirror\n` +
      `This page mirrors the [README of \`${ORG}/${d.name}\`](${d.htmlUrl}#readme).\n` +
      `Source of truth is the repo — edits here will be overwritten on the next build.\n` +
      `:::\n\n` +
      readme.trim() +
      '\n';

    await fs.writeFile(path.join(OUT_DIR, `${d.suffix}.md`), body);
  }

  console.log(`[drivers] wrote ${drivers.length + 1} files to docs/drivers/`);
}

main().catch((err) => {
  console.error('[drivers] failed:', err.message);
  // If we have cached output from a previous run, let the build continue —
  // developers offline shouldn't be blocked. Fail hard only if we have nothing.
  fs.access(path.join(OUT_DIR, 'index.md')).then(
    () => {
      console.warn('[drivers] using previously-generated pages');
      process.exit(0);
    },
    () => process.exit(1),
  );
});
