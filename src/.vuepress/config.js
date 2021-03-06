const { description } = require('../../package')

module.exports = {
  title: 'Разработка ОС',
  description: description,
  base: '/osdev/',
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],
  themeConfig: {
    repo: 'https://github.com/mayerdev/osdev',
    editLinks: false,
    docsDir: '/',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Введение',
        link: '/intro/',
      },
      {
        text: 'Гайд для чайников', // e.g. "baby steps" в оригинале
        link: '/teapot/',
      },
      {
        text: 'Аппаратная часть',
        link: '/hardware/',
      },
      {
        text: 'Конструкция ОС',
        link: '/os/',
      },
      {
        text: 'Ресурсы',
        link: '/resources/',
      },
      {
        text: 'Справочная информация',
        link: '/reference/',
      },
      {
        text: 'Утилиты',
        link: '/tools/',
      },
      {
        text: 'Оригинал',
        link: 'https://wiki.osdev.org/Main_Page'
      },
      {
        text: 'GitHub',
        link: 'https://github.com/mayerdev/osdev'
      }
    ],
    sidebar: [
      {
        title: 'Введение',
        collapsable: false,
        children: [
          '/intro/',
          '/intro/required',
          '/intro/mistakes',
          '/intro/getting-started',
          '/intro/kcl-linking',
          '/intro/isr',
          '/intro/languages',
          '/intro/uefi',
          '/intro/bios',
          '/intro/inline-asm',
        ]
      },
      {
        title: 'Первые шаги',
        collapsable: false,
        children: [
          '/first-steps/bare-bones'
        ]
      }
    ]
  },

  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
