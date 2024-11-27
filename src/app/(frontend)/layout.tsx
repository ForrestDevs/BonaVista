import '@/lib/styles/globals.css'

import React from 'react'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Providers } from '@/lib/providers'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import { Footer } from '@/components/layout/footers/site'
import { LivePreviewListener } from '@/components/payload/LivePreviewListener'
import { AdminBar } from '@/components/payload/AdminBar'
import getPayload from '@/lib/utils/getPayload'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()

  const initData = await payload.findGlobal({
    slug: 'site-settings',
  })

  return {
    title: initData?.general?.appName as string,
    description: initData?.general?.appDescription as string,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
      creator: 'BonaVista Leisurescapes',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/rgs4hpy.css" />
      </head>
      <body>
        <main className="flex min-h-full flex-col">
          <Providers>
            {/* <AdminBar /> */}
            <LivePreviewListener />
            {children}
            <Footer />
          </Providers>
        </main>
      </body>
    </html>
  )
}
