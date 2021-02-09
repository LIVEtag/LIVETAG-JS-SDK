module.exports = {
  /**
   * Ref：https://vuepress.vuejs.org/config/#title
   */
  title: 'LiveTag Docs',
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
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

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
    lastUpdated: false,
    displayAllHeaders: true,
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
        text: 'LiveTag',
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
        title: 'Config',
        path: '/config/',
        collapsable: false,
      },
    ],
  },

  /**
   * Apply plugins，ref：https://vuepress.vuejs.org/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ],
};
