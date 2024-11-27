import React from 'react'
import getPayload from '@/lib/utils/getPayload'
import { Spa } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Media } from '@/components/payload/Media'
import { Button } from '@/components/ui/button'
import { Droplets, Tag, Users } from 'lucide-react'
import Image from 'next/image'
import { FaCompactDisc } from 'react-icons/fa'

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function SwimSpaProductPage({ params }: Args) {
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
      <Hero product={product} />
      <Banner product={product} />
      <ThreeDModel link={product.threeDModel} title={product.title} />
      <Specs product={product} />
    </div>
  )
}

function Hero({ product }: { product: Spa }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Left Column - Product Image */}
        <div className="relative">
          {product.thumbnail && (
            <Media
              resource={product.thumbnail}
              imgClassName="object-cover w-full h-auto rounded-lg"
              priority
            />
          )}
        </div>

        {/* Right Column - Product Information */}
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <p className="text-xl">{product.modelYear}</p>
              <h1 className="text-4xl lg:text-5xl font-bold">
                {product.title} <span className="text-muted-foreground">™</span>
              </h1>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-lg text-muted-foreground">MSRP PRICE*</p>
                <p className="text-xl font-semibold">$49,995</p>
              </div>
              <div className="flex justify-between items-center text-sky-500">
                <p className="text-lg font-medium">PROMO PRICE*</p>
                <p className="text-2xl font-bold">$44,995</p>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-muted-foreground">STARTING FROM</p>
              <p className="text-sky-500 text-4xl font-bold">$92.58</p>
              <p className="text-muted-foreground">WEEKLY PAYMENTS* **</p>
            </div>

            <p className="text-xs text-muted-foreground text-center italic">
              **Financing payment based on 7.99% for 24 months with $1,000 down. The amortization
              period varies by product. Other financing options are available.
            </p>
          </div>

          {/* Buttons Section */}
          <div className="space-y-4">
            <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white py-6 text-lg">
              VIEW SALE PRICING
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              THIS PRICING IS NOT AVAILABLE ONLINE
            </p>
            <Button variant="outline" className="w-full py-6 text-lg border-2">
              FINANCING OPTIONS
            </Button>
            <Button variant="outline" className="w-full py-6 text-lg border-2">
              SAVE $250 - BOOK APPOINTMENT
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Banner({ product }: { product: Spa }) {
  return (
    <div className="bg-primary/20 py-6">
      <div className="container">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <FaCompactDisc className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{product.jets}</p>
            <p className="text-sm text-muted-foreground">JETS</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{product.seating}</p>
            <p className="text-sm text-muted-foreground">SEATS</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Droplets className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{product.volume || '---'}</p>
            <p className="text-sm text-muted-foreground">GALLONS</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThreeDModel({ link, title }: { link: string; title: string }) {
  return (
    <div className="container">
      <div className="flex flex-col space-y-4 px-14 my-10 mb-20 justify-center items-center">
        <h3 className="text-center text-3xl lg:text-4xl font-bold">
          View the {title}<span className="text-muted-foreground">™</span> Swim Spa in your own
          backyard
        </h3>
        <p className="text-center text-muted-foreground max-w-4xl">
          Explore every inch of this swim spa with an innovative 3D view! Take a closer look at the
          features and enjoy a much better approach to planning your spa installation. It&apos;s
          like visiting a showroom to shop for a swim spa, but from the comfort of your home! To see
          this spa in your own backyard, just click view in your space!
        </p>
      </div>
      <iframe src={link} width="100%" allow="clipboard-read; clipboard-write" height="700px" />
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
            {product.title}
          </h1>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">DIMENSIONS</h3>
                <p className="text-muted-foreground">{product.dimensions}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">SEATING</h3>
                <div className="space-y-1">
                  <p className="text-muted-foreground">{product.seating}</p>
                  <p className="text-muted-foreground">{product.seatingDesign}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">JETS</h3>
                <p className="text-muted-foreground">{product.jets}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">FILTRATION</h3>
                <p className="text-muted-foreground">{product.selfCleaning && 'Self Cleaning'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">SPA VOLUME</h3>
                <p className="text-muted-foreground">{product.volume}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">SPA WEIGHT</h3>
                <div className="space-y-1">
                  <p className="text-muted-foreground">{product.weightFull}</p>
                  <p className="text-muted-foreground">{product.weightEmpty}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">WATER MANAGEMENT SYSTEM</h3>
                <p className="text-muted-foreground">{product.ezZonePure}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">ELECTRICAL</h3>
                <p className="text-muted-foreground">{product.electrical}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-[0.5] w-full">
          {product.topdown && (
            <Media resource={product.topdown} className="object-cover w-full h-full" />
          )}
        </div>
      </div>
    </div>
  )
}
