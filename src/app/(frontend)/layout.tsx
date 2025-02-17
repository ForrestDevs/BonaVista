import '@/lib/styles/globals.css'

import React from 'react'
import type { Metadata } from 'next'
import { Providers } from '@/lib/providers'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import { Footer } from '@/components/layout/footers/site'
import getPayload from '@/lib/utils/getPayload'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()

  const initData = await payload.findGlobal({
    slug: 'site-settings',
  })

  return {
    title: initData?.general?.appName || 'BonaVista LeisureScapes',
    description:
      initData?.general?.appDescription ||
      "Toronto's premier destination for luxury hot tubs, swim spas, and outdoor living solutions. Experience BonaVista Leisurescapes' expert guidance, premium Hydropool products, and award-winning customer service.",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SERVER_URL || 'https://bonavistaleisurescapes.com',
    ),
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
      creator: '@bonavistaleisurescapes',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      // className={cn(GeistSans.variable, GeistMono.variable, '!scroll-smooth')}
      lang="en"
      suppressHydrationWarning
      className="!scroll-smooth"
    >
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
        <script
          async
          src="https://cdn-ca.pagesense.io/js/bvleisure/c676b99579df4a90897488e0f49cb527.js"
          type="text/javascript"
        />
        <link rel="stylesheet" href="https://use.typekit.net/rgs4hpy.css" />
      </head>
      <body className="antialiased">
        <main>
          <Providers>
            {children}
            <Footer />
          </Providers>
        </main>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`,
          }}
        />
        <script
          id="zsiqscript"
          src="https://salesiq.zohopublic.ca/widget?wc=6b3900749f2d88dc157e54f6ecfe336fee892b38bbc437ef3a4f73ffbfb8fc41150a20226b9ab8ae137c6050564a94ff"
          defer
        />
      </body>
    </html>
  )
}
