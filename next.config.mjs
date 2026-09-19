import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    viewTransition: true,
  },
  images: {
    minimumCacheTTL: 2678400,
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "syntech.co.za",
      },
      {
        protocol: "https",
        hostname: "www.syntech.co.za",
      },
    ],
  },
};

export default withPayload(nextConfig);
