import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Local uploads are served as static files from /public/uploads/
    // and rendered with unoptimized={true} in ResponsiveImage component.
    // No remote patterns needed for self-hosted storage.
    remotePatterns: [],
  },
};

export default nextConfig;
