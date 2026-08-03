import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const legacyUrl = process.env.API_URL ?? "http://localhost:8080";
    const productUrl = process.env.PRODUCT_API_URL ?? "http://localhost:8081";
    return [
      { source: "/backend-api/products/:path*", destination: `${productUrl}/api/products/:path*` },
      { source: "/backend-api/content/:path*", destination: `${productUrl}/api/content/:path*` },
      { source: "/backend-api/:path*", destination: `${legacyUrl}/api/:path*` }
    ];
  },
};

export default nextConfig;