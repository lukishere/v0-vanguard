/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Removed 'output: export' to enable API routes
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
  },
  allowedDevOrigins: ["192.168.92.1"],
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("@xenova/transformers");
    }

    // Also exclude from client-side bundle
    config.externals = config.externals || [];
    config.externals.push({
      "@xenova/transformers": "commonjs @xenova/transformers",
    });

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Cambiar DENY por SAMEORIGIN para permitir demos en iframes
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "0",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Origin-Agent-Cluster",
            value: "?1",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // CSP para permitir iframes seguros de demos y Clerk
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://clerk.com https://*.clerk.accounts.dev https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://*.clerk.com https://clerk.com https://*.clerk.accounts.dev https://vercel.live https://fonts.googleapis.com",
              "img-src 'self' data: https: https://*.clerk.com https://clerk.com https://*.clerk.accounts.dev https://vercel.live",
              "font-src 'self' https://*.clerk.com https://clerk.com https://*.clerk.accounts.dev https://vercel.live https://fonts.gstatic.com",
              "connect-src 'self' https://*.clerk.com https://clerk.com https://*.clerk.accounts.dev https://clerk-telemetry.com wss://*.clerk.com wss://clerk.com wss://*.clerk.accounts.dev https://vercel.live",
              "worker-src 'self' blob:",
              "frame-ancestors 'self'",
              "frame-src 'self' https://vanguard-demos.vercel.app https://*.vercel.app https://*.web.app https://*.clerk.com https://clerk.com https://vercel.live",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
