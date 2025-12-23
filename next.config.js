/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const csp = [
    "default-src 'self'",
    // NOTE: Next.js requires inline scripts/styles in many setups; keep this pragmatic until we introduce nonces.
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
].join('; ')

const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    experimental: {
        optimizePackageImports: ['@phosphor-icons/react'],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    ...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
                    ...(isProd ? [{ key: 'Content-Security-Policy', value: csp }] : []),
                ],
            },
        ]
    },
}

module.exports = nextConfig
