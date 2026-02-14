module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com'
      }
    ]
  },
  eslint: {
    // dirs: ['components', 'layouts', 'lib', 'pages']
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()'
          }
        ]
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    // Exclude .d.ts files from dayjs locale dynamic import context
    config.plugins.push(
      new (require('webpack')).ContextReplacementPlugin(
        /dayjs[/\\]locale$/,
        /\.js$/
      )
    )
    return config
  }
  // webpack: (config, { dev, isServer }) => {
  //   // Replace React with Preact only in client production build
  //   if (!dev && !isServer) {
  //     Object.assign(config.resolve.alias, {
  //       react: 'preact/compat',
  //       'react-dom/test-utils': 'preact/test-utils',
  //       'react-dom': 'preact/compat'
  //     })
  //   }
  //   return config
  // }
}
