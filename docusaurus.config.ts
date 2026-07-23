import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'BotBlox Documentation',
  tagline: 'Technical resources for BotBlox products',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // TODO: Set the production url of your site here
  url: 'https://BotBlox.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/mmWaveDocs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'BotBlox', // Usually your GitHub org/user name.
  projectName: 'mmWaveDocs', // Usually your repo name.

  trailingSlash: false,
  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
  {
    href: 'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css',
    type: 'text/css',
  },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'BotBlox Docs',
      logo: {
        alt: 'BotBlox Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/docs',
          label: 'mmWave Core',
          position: 'left',
          className: 'navbar-mmwave-link',
        },
        {
          href: 'https://botblox.com',
          label: 'Explore BotBlox',
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
            {
              label: 'mmWave Docs',
              to: '/docs',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'BotBlox Forum',
              href: 'https://forum.botblox.org/',
            },
            {
              label: 'LinkedIn',
              href: 'https://linkedin.com/company/botblox',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'BotBlox Website',
              href: 'https://botblox.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BotBlox, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
