/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    GRAPHQL_URL: process.env.GRAPHQL_URL
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/manage',
        permanent: true
      }
    ]
  }
};

