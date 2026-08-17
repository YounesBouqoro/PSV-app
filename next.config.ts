import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const githubPagesBasePath = "/PSV-app";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? githubPagesBasePath : "",
  assetPrefix: isGitHubPages ? `${githubPagesBasePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? githubPagesBasePath : "",
  },
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: isGitHubPages,
  },
};

export default nextConfig;
