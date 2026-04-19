#!/usr/bin/env node
// Pulls the latest GitHub release from ONQL/server (and the shell client) and
// generates docs/getting-started/downloads.md — one table per OS with direct
// links to the right asset. Runs before `docusaurus start` / `docusaurus build`
// so the page is always in sync with the newest release.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_FILE = path.join(REPO_ROOT, 'docs', 'getting-started', 'downloads.md');

const ORG = 'ONQL';
const SERVER_REPO = 'server';
const SHELL_REPO = 'onql-shell-client';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const ghHeaders = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'onql-docs-fetch-downloads',
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

async function ghJson(url) {
  const res = await fetch(url, { headers: ghHeaders });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

// Try /releases/latest first (excludes prereleases); fall back to the first
// non-draft entry on /releases so we still show something during pre-1.0.
async function latestRelease(repo) {
  const latest = await ghJson(`https://api.github.com/repos/${ORG}/${repo}/releases/latest`);
  if (latest) return latest;
  const all = await ghJson(`https://api.github.com/repos/${ORG}/${repo}/releases`);
  if (!Array.isArray(all)) return null;
  return all.find((r) => !r.draft) || null;
}

// Classify a release asset by OS + arch + package format so we can render one
// row per (os, arch) with the right choice of installers. Names come from
// GoReleaser-style archives, e.g. onql-server_0.1.0_Windows_x86_64.zip.
function classify(name) {
  const lower = name.toLowerCase();
  let os = null;
  if (/(windows|_win_)/.test(lower)) os = 'windows';
  else if (/(darwin|macos|_mac_|osx)/.test(lower)) os = 'macos';
  else if (/linux/.test(lower)) os = 'linux';
  else if (/freebsd/.test(lower)) os = 'freebsd';

  let arch = null;
  if (/(x86_64|amd64)/.test(lower)) arch = 'x86_64';
  else if (/arm64|aarch64/.test(lower)) arch = 'arm64';
  else if (/armv7/.test(lower)) arch = 'armv7';
  else if (/\barm\b/.test(lower)) arch = 'arm';
  else if (/(i386|_386|x86\b)/.test(lower)) arch = 'i386';

  let kind = null;
  if (lower.endsWith('.msi')) kind = 'msi';
  else if (lower.endsWith('.exe')) kind = 'exe';
  else if (lower.endsWith('.zip')) kind = 'zip';
  else if (lower.endsWith('.pkg')) kind = 'pkg';
  else if (lower.endsWith('.dmg')) kind = 'dmg';
  else if (lower.endsWith('.deb')) kind = 'deb';
  else if (lower.endsWith('.rpm')) kind = 'rpm';
  else if (lower.endsWith('.apk')) kind = 'apk';
  else if (lower.endsWith('.tar.gz') || lower.endsWith('.tgz')) kind = 'tar.gz';

  return { os, arch, kind };
}

function formatSize(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 10 ? `${mb.toFixed(0)} MB` : `${mb.toFixed(1)} MB`;
}

// Pretty labels for the table.
const OS_LABELS = { windows: 'Windows', macos: 'macOS', linux: 'Linux', freebsd: 'FreeBSD' };
const ARCH_LABELS = { x86_64: 'x86-64 (Intel/AMD)', arm64: 'ARM64 (Apple Silicon, aarch64)', armv7: 'ARMv7', arm: 'ARM', i386: '32-bit (i386)' };
const KIND_LABELS = { msi: 'MSI', exe: 'EXE', zip: 'ZIP', pkg: 'PKG', dmg: 'DMG', deb: 'DEB', rpm: 'RPM', apk: 'APK', 'tar.gz': 'tar.gz' };

// Preferred installer format per OS, for the "one-click" column. Falls back to
// the archive if the native installer isn't in this release.
const PRIMARY_KIND = {
  windows: ['msi', 'exe', 'zip'],
  macos: ['pkg', 'dmg', 'tar.gz'],
  linux: ['deb', 'rpm', 'apk', 'tar.gz'],
  freebsd: ['tar.gz'],
};

function groupAssets(assets) {
  // Build a map: os -> arch -> { kind: asset }
  const out = {};
  for (const a of assets) {
    const c = classify(a.name);
    if (!c.os || !c.arch || !c.kind) continue;
    out[c.os] ??= {};
    out[c.os][c.arch] ??= {};
    out[c.os][c.arch][c.kind] = a;
  }
  return out;
}

function renderOSSection(os, byArch, checksumsUrl) {
  const archOrder = ['x86_64', 'arm64', 'armv7', 'arm', 'i386'];
  const archs = archOrder.filter((a) => byArch[a]);
  if (archs.length === 0) return '';

  const rows = archs.map((arch) => {
    const kinds = byArch[arch];
    const primary = PRIMARY_KIND[os].find((k) => kinds[k]);
    const primaryAsset = kinds[primary];
    const otherLinks = Object.entries(kinds)
      .filter(([k]) => k !== primary)
      .map(([k, a]) => `[${KIND_LABELS[k]}](${a.browser_download_url})`)
      .join(' · ');

    return `| ${ARCH_LABELS[arch]} | [${primaryAsset.name}](${primaryAsset.browser_download_url}) | ${formatSize(primaryAsset.size)} | ${otherLinks || '—'} |`;
  });

  return [
    `### ${OS_LABELS[os]}`,
    '',
    '| Architecture | Recommended | Size | Other formats |',
    '|---|---|---|---|',
    ...rows,
    '',
  ].join('\n');
}

function renderServerSection(release) {
  if (!release) {
    return [
      '## Server',
      '',
      'No public releases yet. Build from source:',
      '',
      '```bash',
      'git clone https://github.com/ONQL/server',
      'cd server',
      'go build -o onql-server ./cmd/server',
      '```',
      '',
    ].join('\n');
  }

  const grouped = groupAssets(release.assets);
  const checksums = release.assets.find((a) => /checksum|sha256/i.test(a.name));
  const osOrder = ['windows', 'macos', 'linux', 'freebsd'];
  const sections = osOrder.map((os) => (grouped[os] ? renderOSSection(os, grouped[os], checksums?.browser_download_url) : '')).filter(Boolean);

  const header = [
    '## Server',
    '',
    `Latest release: **[${release.tag_name}](${release.html_url})** — published ${release.published_at?.slice(0, 10)}.`,
    '',
    checksums
      ? `Verify your download against [\`${checksums.name}\`](${checksums.browser_download_url}) before running.`
      : '',
    '',
  ].filter(Boolean).join('\n');

  return [header, ...sections].join('\n');
}

function renderShellSection(release) {
  if (!release) {
    return [
      '## Shell client',
      '',
      'The interactive shell doesn\'t have prebuilt binaries yet. Install from source:',
      '',
      '```bash',
      'git clone https://github.com/ONQL/onql-shell-client',
      'cd onql-shell-client',
      'pip install -r requirements.txt',
      'python main.py',
      '```',
      '',
      'Requires Python 3.7 or newer. Prebuilt installers will land on the',
      '[releases page](https://github.com/ONQL/onql-shell-client/releases) once available.',
      '',
    ].join('\n');
  }

  const grouped = groupAssets(release.assets);
  const osOrder = ['windows', 'macos', 'linux'];
  const sections = osOrder.map((os) => (grouped[os] ? renderOSSection(os, grouped[os], null) : '')).filter(Boolean);

  return [
    '## Shell client',
    '',
    `Latest release: **[${release.tag_name}](${release.html_url})** — published ${release.published_at?.slice(0, 10)}.`,
    '',
    ...sections,
  ].join('\n');
}

async function main() {
  console.log('[downloads] fetching latest releases…');
  const [serverRelease, shellRelease] = await Promise.all([
    latestRelease(SERVER_REPO),
    latestRelease(SHELL_REPO),
  ]);

  console.log('[downloads] server:', serverRelease ? serverRelease.tag_name : '(none)');
  console.log('[downloads] shell :', shellRelease ? shellRelease.tag_name : '(none)');

  const body = `---
id: downloads
title: Downloads
sidebar_position: 2
description: Prebuilt ONQL server and shell client binaries for Windows, macOS, Linux and FreeBSD.
---

# Downloads

Prebuilt binaries for every platform we ship. This page is regenerated on
every docs build, so the links always point at the latest GitHub release.

${renderServerSection(serverRelease)}

${renderShellSection(shellRelease)}

## What's next

- [Install the server and shell](./installation.md) — step-by-step setup
- [Define your schema](./schema.md) — zero-SQL migrations
- [Run your first query](./first-query.md)
`;

  await fs.writeFile(OUT_FILE, body);
  console.log('[downloads] wrote', path.relative(REPO_ROOT, OUT_FILE));
}

main().catch((err) => {
  console.error('[downloads] failed:', err.message);
  // If we already have a file from a previous run, keep it so offline dev
  // still works. Fail hard only if there's nothing to fall back on.
  fs.access(OUT_FILE).then(
    () => {
      console.warn('[downloads] using previously-generated page');
      process.exit(0);
    },
    () => process.exit(1),
  );
});
