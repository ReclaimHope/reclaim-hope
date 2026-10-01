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
  // Prisma uses a custom generator output (lib/generated/prisma). The query
  // engine binary is loaded dynamically, so file-tracing must be told to
  // include it in every route bundle (fixes "Query Engine not found" on
  // Vercel). NOTE: add new Prisma-backed routes here when created.
  outputFileTracingIncludes: {
    '/': ['./lib/generated/prisma/**/*'],
    '/about': ['./lib/generated/prisma/**/*'],
    '/contact': ['./lib/generated/prisma/**/*'],
    '/dashboard': ['./lib/generated/prisma/**/*'],
    '/donate': ['./lib/generated/prisma/**/*'],
    '/impact': ['./lib/generated/prisma/**/*'],
    '/login': ['./lib/generated/prisma/**/*'],
    '/shop': ['./lib/generated/prisma/**/*'],
    '/sponsor': ['./lib/generated/prisma/**/*'],
    '/newsletter': ['./lib/generated/prisma/**/*'],
    '/programs': ['./lib/generated/prisma/**/*'],
    '/MediaCenter': ['./lib/generated/prisma/**/*'],
    '/GetInvolved': ['./lib/generated/prisma/**/*'],
    '/GetInvolved/partner': ['./lib/generated/prisma/**/*'],
    '/GetInvolved/volunteer': ['./lib/generated/prisma/**/*'],
    '/newsletter/[slug]': ['./lib/generated/prisma/**/*'],
    '/programs/[slug]': ['./lib/generated/prisma/**/*'],
    '/admin': ['./lib/generated/prisma/**/*'],
    '/admin/children': ['./lib/generated/prisma/**/*'],
    '/admin/donations': ['./lib/generated/prisma/**/*'],
    '/admin/donors': ['./lib/generated/prisma/**/*'],
    '/admin/newsletters': ['./lib/generated/prisma/**/*'],
    '/admin/payment-test': ['./lib/generated/prisma/**/*'],
    '/admin/payments': ['./lib/generated/prisma/**/*'],
    '/admin/reports': ['./lib/generated/prisma/**/*'],
    '/admin/sponsors': ['./lib/generated/prisma/**/*'],
    '/api/admin/attention': ['./lib/generated/prisma/**/*'],
    '/api/admin/db-check': ['./lib/generated/prisma/**/*'],
    '/api/admin/newsletters': ['./lib/generated/prisma/**/*'],
    '/api/admin/reports': ['./lib/generated/prisma/**/*'],
    '/api/children': ['./lib/generated/prisma/**/*'],
    '/api/contact': ['./lib/generated/prisma/**/*'],
    '/api/donations': ['./lib/generated/prisma/**/*'],
    '/api/payment': ['./lib/generated/prisma/**/*'],
    '/api/payments/status': ['./lib/generated/prisma/**/*'],
    '/api/payments/irembo/callback': ['./lib/generated/prisma/**/*'],
    '/api/payments/irembo/test-webhook': ['./lib/generated/prisma/**/*'],
    '/api/sponsorships': ['./lib/generated/prisma/**/*'],
  },
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
