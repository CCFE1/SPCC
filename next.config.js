/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };
    return config;
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
