import type { NextConfig } from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions ? '/Website' : '',
  assetPrefix: isGithubActions ? '/Website' : '',
};

export default nextConfig;
