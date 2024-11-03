import React from 'react'
import getPayload from '@/lib/utils/getPayload'
import { Spa } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function HotTubProductPage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload()
  const product = await payload
    .find({
      collection: 'spas',
      where: {
        slug: { equals: slug },
      },
    })
    .then(({ docs }) => docs[0])

  return (
    <div className="flex flex-col min-h-screen space-y-10">
      <div className="container">
        <h3 className="text-center mb4">Experience the Serenity 4500 in 3D</h3>
        <iframe
          src="https://hydropool-configurator.web.app/eTP6uOVT3IOTiDpNELV5?lang=en&model_switcher=Oi40CzdGjvvK1UM9vqEt&cover"
          width="100%"
          allow="clipboard-read; clipboard-write"
          height="700px"
        ></iframe>
      </div>

      <Specs product={product} />
    </div>
  )
}

function Specs({ product }: { product: Spa }) {
  return (
    <div className="container">
      <div className="text-sm uppercase tracking-wide text-sky-600 mb-6">Specifications</div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-12">
        <div className="space-y-12">
          <h1 className="text-4xl font-light tracking-tight text-slate-900 lg:text-5xl">
            Signature Self Cleaning 770
          </h1>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">DIMENSIONS</h3>
                <p className="text-muted-foreground">15&apos; x 4&apos; x 4&apos; (L x W x H)</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">SEATING</h3>
                <div className="space-y-1">
                  <p className="text-muted-foreground">3 Adults</p>
                  <p className="text-muted-foreground">Open Seating</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">JETS</h3>
                <p className="text-muted-foreground">27 Jets</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">FILTRATION</h3>
                <p className="text-muted-foreground">-</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">SPA VOLUME</h3>
                <p className="text-muted-foreground">1770 gal</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">SPA WEIGHT</h3>
                <div className="space-y-1">
                  <p className="text-muted-foreground">19420 lbs. Filled</p>
                  <p className="text-muted-foreground">2905 lbs. Dry</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">WATER MANAGEMENT SYSTEM</h3>
                <p className="text-muted-foreground">UVC + CD Ozone</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">ELECTRICAL</h3>
                <p className="text-muted-foreground">-</p>
              </div>
            </div>
          </div>

          {/* <Button variant="secondary" className="w-full sm:w-auto h-auto py-3 px-6 text-sm">
            <FileDown className="mr-2 h-4 w-4" />
            DOWNLOAD E500 FITNESS SYSTEM BROCHURE
          </Button> */}
        </div>

        <div className="relative aspect-[0.5] w-full">
          <img src="/728.jpg" alt="15' Swim Spa Top View" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  )
}
