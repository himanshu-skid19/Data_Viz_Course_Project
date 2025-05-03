/** @type {import('next').NextConfig} */
module.exports = {
  //reactStrictMode: false,
  images: {
    domains: ['images.unsplash.com'],
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/example/login',
        permanent: false,
      },
    ]
  }
}
