const withPWA = require('next-pwa') 

module.exports = withPWA({
  pwa: {
    dest: 'public'
  },
  reactStrictMode: true,
  optimization: {
    minimize: false,
  },
  compress: false,
  webpack:(config,{
    webpack
  }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
      })
    );
    config.resolve.modules.push(__dirname)
    return config;
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  experimental: {
    concurrentFeatures: false,
    images: {
      layoutRaw: true
    }
  },
  async redirects() {
    return [
      {
        source: '/gift/cards',
        destination: '/gift-cards',
        permanent: true
      },
      {
        source: '/product/:productid/:title',
        destination: '/product-:productid/:title',
        permanent: true
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/gift-cards',
        destination: '/gift/cards',
      },
      {
        source: '/product-:productid/:title',
        destination: '/product/:productid/:title',
      },
      {
        source: '/dic/:url',
        destination: '/blog/categories/:url',
      },
    ]
  },
  i18n: {
    locales: ["fa", "en", "ar"],
    defaultLocale: "fa",
    domains: [
      {
        domain: 'diza.gallery',
        defaultLocale: 'fa'
      },
      {
        domain: 'diza.com',
        defaultLocale: 'en'
      }
    ],
    localeDetection: false
  }
})