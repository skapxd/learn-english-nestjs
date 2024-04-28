/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: false,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '192.168.0.111:3000',
        'r1x0tt84-3000.use2.devtunnels.ms'
      ]
    }
  }
}

module.exports = nextConfig
// export default nextConfig