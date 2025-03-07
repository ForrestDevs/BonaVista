import React, { Suspense } from 'react'
import getPayload from '@/lib/utils/getPayload'
import { Spa } from '@/payload-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Media } from '@/components/payload/Media'
import { Button } from '@/components/ui/button'
import { Droplets, Tag, Users } from 'lucide-react'
import Image from 'next/image'
import { FaCompactDisc } from 'react-icons/fa'
import LoadingPage from '@/components/layout/suspense/loading-page'
import { querySpaBySlug } from '@/lib/utils/queryBySlug'
import { SPA_SLUG } from '@/payload/collections/constants'
import { generateMeta } from '@/lib/utils/generateMeta'
import { Metadata } from 'next'
import { formatMoney } from '@/lib/utils/formatMoney'
import Link from 'next/link'
type Args = {
  params: Promise<{ slug?: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const spa = await querySpaBySlug(slug)

  return generateMeta({ doc: spa, collectionSlug: SPA_SLUG })
}

export default async function HotTubProductPage({ params }: Args) {
  const { slug } = await params
  const spa = await querySpaBySlug(slug)

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex flex-col min-h-screen space-y-10">
        <Hero product={spa} />
        <Banner product={spa} />
        <ThreeDModel link={spa.threeDModel} title={spa.title} />
        <Specs product={spa} />
      </div>
    </Suspense>
  )
}

function Hero({ product }: { product: Spa }) {
  const calculateWeeklyPayment = (price: number): number => {
    // Constants from the financing terms
    const downPayment = 1000
    const apr = 13.99 / 100 // Convert percentage to decimal
    const amortizationPeriodMonths = 240
    const termMonths = 60
    const adminFee = 149

    // Calculate purchase amount after down payment and adding admin fee
    const purchaseAmount = price - downPayment + adminFee

    // Monthly interest rate
    const monthlyInterestRate = apr / 12

    // Calculate monthly payment using amortization formula
    const monthlyPayment =
      (purchaseAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, amortizationPeriodMonths)) /
      (Math.pow(1 + monthlyInterestRate, amortizationPeriodMonths) - 1)

    // Convert monthly payment to weekly
    const weeklyPayment = (monthlyPayment * 12) / 52

    return weeklyPayment
  }

  const weeklyPayment = calculateWeeklyPayment(product.startingPrice)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="relative">
          {product.thumbnail && (
            <Media
              resource={product.thumbnail}
              imgClassName="object-cover w-full h-auto rounded-lg"
              priority
            />
          )}
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <p className="text-xl">{product.modelYear}</p>
              <h1 className="text-4xl lg:text-5xl font-bold">
                {product.title} <span className="text-muted-foreground">™</span>
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-lg text-muted-foreground">MSRP PRICE*</p>
                <p className="text-xl font-semibold">
                  {formatMoney({ amount: product.startingPrice, currency: 'CAD' })}
                </p>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-muted-foreground">STARTING FROM</p>
              <p className="text-sky-500 text-4xl font-bold">${weeklyPayment.toFixed(2)}</p>
              <p className="text-muted-foreground">WEEKLY PAYMENTS* **</p>
            </div>

            <p className="text-xs text-muted-foreground text-center italic">
              **Financing payment based on 13.99% for 60 months with $1,000 down. The amortization
              period varies by product. Other financing options are available.
            </p>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full py-6 text-lg border-2" asChild>
              <Link href="https://www.financeit.ca/s/Cqye-w">FINANCING OPTIONS</Link>
            </Button>
            <Button variant="outline" className="w-full py-6 text-lg border-2" asChild>
              <Link href="/contact">SAVE $250 - BOOK APPOINTMENT</Link>
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
          View the {title}
          <span className="text-muted-foreground">™</span> Hot Tub in your own backyard
        </h3>
        <p className="text-center text-muted-foreground max-w-4xl">
          Explore every inch of this hot tub with an innovative 3D view! Take a closer look at the
          features and enjoy a much better approach to planning your spa installation. It&apos;s
          like visiting a showroom to shop for a hot tub, but from the comfort of your home! To see
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

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
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

          {/* <Button variant="secondary" className="w-full sm:w-auto h-auto py-3 px-6 text-sm">
            <FileDown className="mr-2 h-4 w-4" />
            DOWNLOAD E500 FITNESS SYSTEM BROCHURE
          </Button> */}
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
