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
    sidebar: {
      '/intro/': [
        {
          title: 'Введение',
          collapsable: false,
          children: [
            '',
            'required',
            'mistakes',
            'getting-started',
            'kcl-linking',
            'isr',
            'languages',
            'uefi',
            'bios',
            'inline-asm',
            'first-steps',
            'first-steps-ada',
            'first-steps-d',
            'first-steps-pascal',
            'first-steps-freebasic',
            'skeleton',
            'boot'
          ]
        }
      ],
    }
  },

  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
