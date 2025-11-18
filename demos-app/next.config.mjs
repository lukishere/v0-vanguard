/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para demos embebidas
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Permitir embedding desde dominios específicos
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://*.vercel.app'
          },
          // CSP para demos embebidas
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'self' https://*.vercel.app https://*.web.app",
              "object-src 'none'",
              "base-uri 'self'"
            ].join('; ')
          },
          // Headers de seguridad estándar
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}

export default nextConfig

