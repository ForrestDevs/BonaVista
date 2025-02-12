import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
          pathname: '/**', // Wildcard for all paths
        }
      }),
      {
        hostname: 'www2.bonavistaleisurescapes.com',
        protocol: 'https',
        pathname: '/**',
      },
      {
        hostname: 'bonavistaleisurescapes.com',
        protocol: 'https',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    devIndicators: true,
    buildActivity: true,
    appIsrStatus: true,
  },
  experimental: {
    //   scrollRestoration: true,
    // staticGenerationRetryCount: 1,
    // staticGenerationMaxConcurrency: 2,
    // staticGenerationMinPagesPerWorker: 25,
  },
  redirects,
}

export default withPayload(nextConfig)
