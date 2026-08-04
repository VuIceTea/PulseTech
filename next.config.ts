import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const gatewayUrl = process.env.API_URL ?? "http://localhost:8080";
    return [
      { source: "/backend-api/:path*", destination: `${gatewayUrl}/api/:path*` }
    ];
  },
};

export default nextConfig;