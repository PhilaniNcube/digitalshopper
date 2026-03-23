/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  images: {
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

module.exports = nextConfig;
