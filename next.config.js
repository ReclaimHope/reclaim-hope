/** @type {import('next').NextConfig} */
const r2PublicUrl = process.env.R2_PUBLIC_URL;
const r2ImagePattern = r2PublicUrl
  ? (() => {
      try {
        const url = new URL(r2PublicUrl);
        return { protocol: url.protocol.replace(":", ""), hostname: url.hostname, pathname: `${url.pathname.replace(/\/$/, "")}/**` };
      } catch {
        return null;
      }
    })()
  : null;

const nextConfig = {
  images: {
    remotePatterns: r2ImagePattern ? [r2ImagePattern] : [],
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 85, 95],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '75mb',
    },
  },
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
