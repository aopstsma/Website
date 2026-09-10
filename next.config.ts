import type { NextConfig } from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions ? '/Website' : '',
  assetPrefix: isGithubActions ? '/Website' : '',
};

export default nextConfig;
