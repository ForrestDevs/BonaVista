import '@/lib/styles/globals.css'

import React from 'react'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Providers } from '@/lib/providers'
import { mergeOpenGraph } from '@/lib/utils/merge-open-graph'
import config from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { getLocale } from 'next-intl/server'
import { Footer } from '@/components/layout/footer'

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
      <body>
        <main className="flex min-h-full flex-col">
          <Providers>
            {children}
            <Footer />
          </Providers>
        </main>
      </body>
    </html>
  )
}
