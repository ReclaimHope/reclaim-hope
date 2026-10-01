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

// Prisma engine files needed in every server bundle: the generated client
// plus a copy of the native engine one level up (see
// scripts/copy-prisma-engine.mjs — the loader probes lib/generated/).
const prismaTraceFiles = ['./lib/generated/prisma/**/*', './lib/generated/*.node'];

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
  // NOTE: add new Prisma-backed routes to outputFileTracingIncludes below.
  outputFileTracingIncludes: {
    '/': prismaTraceFiles,
    '/about': prismaTraceFiles,
    '/contact': prismaTraceFiles,
    '/dashboard': prismaTraceFiles,
    '/donate': prismaTraceFiles,
    '/impact': prismaTraceFiles,
    '/login': prismaTraceFiles,
    '/shop': prismaTraceFiles,
    '/sponsor': prismaTraceFiles,
    '/newsletter': prismaTraceFiles,
    '/programs': prismaTraceFiles,
    '/MediaCenter': prismaTraceFiles,
    '/GetInvolved': prismaTraceFiles,
    '/GetInvolved/partner': prismaTraceFiles,
    '/GetInvolved/volunteer': prismaTraceFiles,
    '/newsletter/[slug]': prismaTraceFiles,
    '/programs/[slug]': prismaTraceFiles,
    '/admin': prismaTraceFiles,
    '/admin/children': prismaTraceFiles,
    '/admin/donations': prismaTraceFiles,
    '/admin/donors': prismaTraceFiles,
    '/admin/newsletters': prismaTraceFiles,
    '/admin/payment-test': prismaTraceFiles,
    '/admin/payments': prismaTraceFiles,
    '/admin/reports': prismaTraceFiles,
    '/admin/sponsors': prismaTraceFiles,
    '/api/admin/attention': prismaTraceFiles,
    '/api/admin/newsletters': prismaTraceFiles,
    '/api/admin/reports': prismaTraceFiles,
    '/api/children': prismaTraceFiles,
    '/api/contact': prismaTraceFiles,
    '/api/donations': prismaTraceFiles,
    '/api/payment': prismaTraceFiles,
    '/api/payments/status': prismaTraceFiles,
    '/api/payments/irembo/callback': prismaTraceFiles,
    '/api/payments/irembo/test-webhook': prismaTraceFiles,
    '/api/sponsorships': prismaTraceFiles,
  },
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
