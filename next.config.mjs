import path from 'path'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import redirects from './redirects.js'
const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  experimental: {
    esmExternals: true,
    mdxRs: true,
    scrollRestoration: true,
    ppr: false,
    after: true,
  },
  devIndicators: {
    devIndicators: true,
    buildActivity: true,
    appIsrStatus: true,
  },
  // reactStrictMode: true,
  redirects,
}
export default withNextIntl(withPayload(nextConfig))
