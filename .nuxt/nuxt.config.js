/**
 * Define router base folder path, for all situations.
 * On:
 *  - generate          - path will be /ui/
 *  - generate:gh-pages - path will be /Conext/
 *  - dev               - path will be /
 */
const router = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  middleware: ['check-auth'],
  base: '/Conext/'
} : {
  middleware: ['check-auth'],
  base: (process.env.npm_lifecycle_event === 'dev' ? '/' : '/ui/')
}

// change _nuxt assets path, same for both on this project
const publicPath = process.env.DEPLOY_ENV === 'GH_PAGES' ? '/dist/' : '/dist/'

/**
 * @see: node_modules/lib/common/options.js
 */
module.exports = {
  mode: 'spa',
  head: {
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#3B8070' },
  router: {
    ...router
  },
  plugins: [
    { src: '~plugins/localStorage.js', ssr: false },
    { src: '~plugins/nuxt-codemirror-plugin.js', ssr: false },
    '~/plugins/prompt/index.js',
    '~/plugins/nag/index.js'
  ],
  modules: [
    '@nuxtjs/font-awesome',
    '@nuxtjs/vuetify'
  ],
  css: [
    'xterm/dist/xterm.css',
    'codemirror/lib/codemirror.css'
  ],
  generate: {
    extractCSS: true,
    minify: {
      collapseBooleanAttributes: true,
      collapseWhitespace: false,
      decodeEntities: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      removeAttributeQuotes: false,
      removeComments: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: false,
      removeStyleLinkTypeAttributes: false,
      removeTagWhitespace: false,
      sortAttributes: true,
      sortClassName: false,
      trimCustomFragments: true,
      useShortDoctype: true
    }
  },
  build: {
    extractCSS: true,
    publicPath: publicPath,
    vendor: [
      'babel-polyfill',
      'axios'
    ],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  messages: {
    error_404: 'Page could not be found',
    server_error: 'Server error',
    nuxtjs: 'Nuxt.js',
    back_to_home: 'Go back to the home page',
    server_error_details: 'An error occurred in the application and your page could not be served.',
    client_error: 'Error',
    client_error_details: 'An error occurred while rendering the page.'
  }
}
