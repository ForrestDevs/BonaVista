import getPayload from '@lib/utils/getPayload'
import { PAGE_SLUG, PRODUCT_SLUG } from '@payload/collections/constants'
import { Metadata } from 'next'
import Link from 'next/link'
import { cache, Fragment, Suspense } from 'react'
import { Button } from '@components/ui/button'
import {
  ChevronRightIcon,
  SparklesIcon,
  DropletIcon,
  BeakerIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
  MenuIcon,
  Shield,
  Truck,
  Star,
} from 'lucide-react'
import { Carousel } from '@/components/shop/layout/carousel'
import Image from 'next/image'
import { ProductCard } from '@/components/shop/products/product-card'
import SkeletonShopHome from '@/components/shop/skeletons/layout/skele-shop-home'
import { queryPageBySlug } from '@/lib/utils/queryBySlug'
import { generateMeta } from '@/lib/utils/generateMeta'
import { notFound } from 'next/navigation'
import { RenderHero } from '@/components/payload/heros'
import { OptimizedLink } from '@/components/payload/Link/optimized-link'

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug('shop')

  return generateMeta({ doc: page, collectionSlug: PAGE_SLUG })
}

export default async function StoreHome() {
  const payload = await getPayload()

  const shopLayout = await queryPageBySlug('shop')

  if (!shopLayout) {
    return notFound()
  }

  const bestSellers = await payload
    .find({
      collection: PRODUCT_SLUG,
      depth: 1,
      where: {
        collections: {
          in: [1],
        },
      },
    })
    .then((res) => {
      return res.docs
    })

  return (
    <Suspense fallback={<SkeletonShopHome />}>
      <div className="flex flex-col min-h-screen gap-20">
        <RenderHero {...shopLayout.hero} />

        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e365c]">Shop Our Top Selling Products</h2>
            <div className="w-48 h-px bg-gray-200 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1e365c]">Shop by Category</h2>
              <div className="w-48 h-px bg-gray-200 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  className="relative overflow-hidden rounded-lg group"
                  href={`/shop/category/${category.slug}`}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={400}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-br from-white to-[#f8fbfd] rounded-3xl p-12 shadow-lg max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1 bg-[#e8f1f5] text-[#1e365c] text-sm font-medium rounded-full mb-3">
                PREMIUM WATER CARE
              </span>
              <h2 className="text-4xl font-bold text-[#1e365c] mt-2">
                The Mineraluxe Hot Tub Care System
              </h2>
              <div className="w-24 h-1 bg-[#1e365c] mx-auto mt-4 rounded-full" />
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Experience crystal clear water with our advanced hot tub care solution
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1e365c] to-[#4a7eb5] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative">
                  <Image
                    src="/mineraluxe.jpg"
                    alt="Mineraluxe Hot Tub Care System"
                    width={600}
                    height={600}
                    className="rounded-lg shadow-md object-cover w-full h-auto"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-[#1e365c] font-semibold">Trusted by professionals</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {mineraluxeSteps.map((step) => (
                  <div
                    key={step.number}
                    className="flex gap-5 items-start group transition-all duration-200 hover:translate-x-1"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1e365c] flex items-center justify-center text-white font-bold shadow-md">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1e365c] text-xl">{step.title}</h3>
                      <p className="text-gray-600 mt-2 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <OptimizedLink
                    href="/shop/brand/mineraluxe"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white rounded-lg transition-all duration-300 transform hover:scale-105 bg-[#1e365c] hover:bg-[#2a4a7c] shadow-md hover:shadow-xl"
                  >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    SHOP MINERALUXE
                  </OptimizedLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#c5e8f7] py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1e365c] text-center mb-12">
              Why Choose BonaVista
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Star className="w-12 h-12 text-[#1e365c] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1e365c] mb-2">Expert Advice</h3>
                <p className="text-gray-600">
                  Our team of pool and spa experts are here to help you make the best choices for
                  your needs.
                </p>
              </div>
              <div className="text-center">
                <Truck className="w-12 h-12 text-[#1e365c] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1e365c] mb-2">Fast Shipping</h3>
                <p className="text-gray-600">
                  Enjoy free shipping on orders over $250 in Toronto and quick delivery to your
                  doorstep.
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-[#1e365c] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1e365c] mb-2">Quality Guarantee</h3>
                <p className="text-gray-600">
                  We stand behind the quality of our products with our satisfaction guarantee.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  )
}

const mineraluxeSteps = [
  {
    number: 1,
    title: 'Mineraluxe Cube',
    description:
      'An advanced fusion of natural minerals with built-in cleanse and repel technology. Loosens scale and mineral deposits from surfaces and prevents them from reattaching.',
  },
  {
    number: 2,
    title: 'Mineraluxe Oxygen',
    description:
      'Deep cleanses bather wastes to reduce odours and give you the ultimate in water comfort and clarity.',
  },
  {
    number: 3,
    title: 'Choose a Mineraluxe Sanitizer',
    description:
      'Select the sanitizer that best suits your lifestyle. Choose between chlorine or bromine, tablets or granules',
  },
]

const categories = [
  { name: 'Water Care', image: '/mineraluxe.jpg', slug: 'water-care' },
  { name: 'Filters', image: '/api/media/file/75sqft-filter-5x20-18.webp', slug: 'filters' },
  {
    name: 'Accessories',
    image: '/api/media/file/zephira-maintenance-kit.webp',
    slug: 'accessories',
  },
  {
    name: 'Fragrances',
    image: '/api/media/file/aromatherapy-eucalyptus-salts-385-gm.webp',
    slug: 'fragrances',
  },
]
