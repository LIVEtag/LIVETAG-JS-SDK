const env = require('../../../env');
const webpack = require('webpack');

module.exports = {
  markdown: {
    extendMarkdown: (md) => {
      const render = md.render;

      md.render = (...args) => {
        // original content
        const html = render.call(md, ...args);

        return Object.entries(env).reduce(
          (result, [key, value]) => result.replace(new RegExp(`\{${key}\}`, 'g'), value),
          html
        );
      };
    },
  },
  configureWebpack: (config) => {
    return {
      plugins: [new webpack.EnvironmentPlugin({ ...process.env })],
    };
  },
  /**
   * Ref：https://vuepress.vuejs.org/config/#title
   */
  title: 'Livetag Docs',
  /**
   * Ref：https://vuepress.vuejs.org/config/#description
   */
  description: '',

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
  ],
  theme: 'yuu',
  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: true,
    displayAllHeaders: true,
    sidebarDepth: 3,
    nav: [
      {
        text: 'Guide',
        link: '/',
      },
      {
        text: 'Config',
        link: '/config/',
      },
      {
        text: 'Livetag',
        link: 'https://www.livetag.sg/',
      },
    ],
    sidebar: [
      {
        title: 'Guide',
        path: '/',
        collapsable: false,
      },
      {
        title: 'Integration',
        path: '/integration/',
        collapsable: false,
      },
      {
        title: 'Config',
        path: '/config/',
        collapsable: false,
      },
    ],
  },

  /**
   * Apply plugins，ref：https://vuepress.vuejs.org/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],
};
