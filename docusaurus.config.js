// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/synthwave84');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CyberDevSpace',
  tagline: 'Нотатки про технології і саморозвиток.',
  url: 'https://cyberdev.space',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'PetroOstapuk', // Usually your GitHub org/user name.
  projectName: 'CyberDevSpace', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'uk',
    locales: ['uk'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js')
        },
        blog: {
          showReadingTime: true
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'CyberDevSpace',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'bookshelf/technical_books',
            position: 'left',
            label: 'Tutorials',
          },
          {to: '/blog', label: 'Блог', position: 'left'},
          {to: '/about-me', label: 'Про автора', position: 'left'},
          {
            href: 'https://github.com/PetroOstapuk/CyberDevSpace',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Tutorials',
            items: [
              {
                label: 'Дизайн патерни на PHP',
                to: '/docs/patterns/design-patterns-php',
              },
              {
                label: 'Чистий код на PHP',
                to: '/docs/patterns/design-patterns-php',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/petro-ostapuk/',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/OstapukPetro',
              },
            ],
          },
          {
            title: 'Більше',
            items: [
              {
                label: 'Блог',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/PetroOstapuk',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} CyberDevSpace.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['php'],
      },
    }),
};

module.exports = config;
