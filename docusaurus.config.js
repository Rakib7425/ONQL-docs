// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ONQL',
  tagline: 'Object Notation Query Language — describe your data, skip the API.',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://onql.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config
  organizationName: 'ONQL', // Usually your GitHub org/user name.
  projectName: 'server', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // .md files (including fetched driver READMEs) are parsed as CommonMark,
  // .mdx files keep full MDX features. Keeps upstream READMEs safe from MDX
  // tripping on stray `<` or `{` characters.
  markdown: {
    format: 'detect',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Serve docs at the site root — there is no separate homepage.
          routeBasePath: '/',
          // Edit-on-GitHub link — points contributors to the right file.
          editUrl: 'https://github.com/ONQL/server/edit/main/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/onql-social-card.png',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'ONQL',
        logo: {
          alt: 'ONQL Logo',
          src: 'img/logo.svg',
        },
        items: [
          { to: '/intro', label: 'Docs', position: 'left' },
          { to: '/tour/basics', label: 'Tour', position: 'left' },
          { to: '/language/syntax', label: 'Language', position: 'left' },
          { to: '/cookbook/dashboards', label: 'Cookbook', position: 'left' },
          { to: '/reference/cheatsheet', label: 'Reference', position: 'left' },
          {
            href: 'https://github.com/ONQL',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Introduction', to: '/intro' },
              { label: 'Getting Started', to: '/getting-started/installation' },
              { label: 'Tour', to: '/tour/basics' },
              { label: 'Reference', to: '/reference/cheatsheet' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'GitHub Discussions', href: 'https://github.com/ONQL/server/discussions' },
              { label: 'Issues', href: 'https://github.com/ONQL/server/issues' },
            ],
          },
          {
            title: 'Project',
            items: [
              { label: 'GitHub Org', href: 'https://github.com/ONQL' },
              { label: 'Server', href: 'https://github.com/ONQL/server' },
              { label: 'Shell', href: 'https://github.com/ONQL/shell' },
              { label: 'License', href: 'https://github.com/ONQL/server/blob/main/LICENSE' },
              { label: 'Contributing', href: 'https://github.com/ONQL/server/blob/main/docs/CONTRIBUTING.md' },
            ],
          },
        ],
        copyright: `ONQL — Object Notation Query Language. Open source. Built with ❤︎ on Go &amp; BadgerDB.`,
      },
      prism: {
        theme: prismThemes.vsDark,
        darkTheme: prismThemes.vsDark,
        additionalLanguages: ['bash', 'json', 'go'],
      },
    }),
};

export default config;
