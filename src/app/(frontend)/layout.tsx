import '@/lib/styles/globals.css'

import React from 'react'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { AdminBar } from '@/components/payload/AdminBar'
// import { Footer } from '@/components/Footer'
// import { Header } from '@/components/Header'
// import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/lib/providers'
import { InitTheme } from '@/lib/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/lib/utils/merge-open-graph'
import config from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { getLocale, getMessages } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadHMR({ config })
  const initData = await payload.findGlobal({
    slug: 'settings',
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
  const locale = await getLocale()

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          {/* <AdminBar /> */}
          {/* <LivePreviewListener /> */}
          {/* <Header /> */}
          {children}
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  )
}
