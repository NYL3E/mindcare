import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Requis pour Cloudflare Pages
  // @ts-expect-error — option spécifique à @cloudflare/next-on-pages
  experimental: { esmExternals: true },
};

export default nextConfig;
