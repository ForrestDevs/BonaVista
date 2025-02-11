import getPayload from '@lib/utils/getPayload'
import { PAGE_SLUG, PRODUCT_SLUG, SHOP_COLLECTION_SLUG } from '@payload/collections/constants'
import { Metadata } from 'next'
import Link from 'next/link'
import { cache, Fragment, Suspense } from 'react'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card'
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
import { draftMode } from 'next/headers'
import { generateMeta } from '@lib/utils/generateMeta'
import { Page } from '@payload-types'
import { getDocument, getCachedDocument } from '@lib/utils/getDocument'
import { RenderBlocks } from '@components/payload/blocks'
import { RenderHero } from '@components/payload/heros'
import { Carousel } from '@/components/shop/carousel'
import Image from 'next/image'
import { ProductCard } from '@/components/shop/products/product-card'
import SkeletonShopHome from '@/components/shop/skeletons/layout/skele-shop-home'

export const metadata: Metadata = {
  title: 'Shop | BonaVista Leisurescapes',
  description: 'Shop online at BonaVista Leisurescapes for premium water care solutions',
}

const carouselSlides = [
  {
    title: "Got a hot tub? We've got you.",
    description: 'Complete water care solutions for your perfect spa experience',
    image: '/728.jpg',
    cta: 'Shop Now',
    link: '/products',
  },
  {
    title: 'Mineraluxe Hot Tub Care System',
    description: 'Advanced fusion of natural minerals for crystal clear water',
    image: '/swimspa.jpg',
    cta: 'Learn More',
    link: '/mineraluxe',
  },
  {
    title: 'Professional Pool Care',
    description: 'Everything you need for pristine pool maintenance',
    image: '/chems.webp',
    cta: 'Explore Products',
    link: '/pool-care',
  },
]

const featuredProducts = [
  {
    id: 1,
    name: 'Mineraluxe Oxygen',
    price: '40.24',
    maxPrice: '92.80',
    image: '/placeholder.svg?height=300&width=300',
  },
  {
    id: 2,
    name: 'Dazzle Alkalinity Plus',
    price: '24.76',
    image: '/placeholder.svg?height=300&width=300',
  },
  {
    id: 3,
    name: 'Pristiva Salt Pool Maintenance Kit',
    price: '207.95',
    image: '/placeholder.svg?height=300&width=300',
  },
  {
    id: 4,
    name: 'Dazzle Amaze Plus',
    price: '42.44',
    image: '/placeholder.svg?height=300&width=300',
  },
]

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
  { name: 'Filters', image: '/mineraluxe.jpg', slug: 'filters' },
  { name: 'Accessories', image: '/mineraluxe.jpg', slug: 'accessories' },
  { name: 'Fragrances', image: '/mineraluxe.jpg', slug: 'fragrances' },
]

export const dynamic = 'force-dynamic'

export default async function StoreHome() {
  const payload = await getPayload()

  // const { docs: collections } = await payload.find({
  //   collection: SHOP_COLLECTION_SLUG,
  // })

  // const page = await getCachedDocument<typeof PAGE_SLUG>(PAGE_SLUG, 'shop', 1)

  // if (!page) {
  //   return <div>Page not found</div>
  // }

  const bestSellers = await payload
    .find({
      collection: PRODUCT_SLUG,
      depth: 1,
      where: {
        collections: {
          in: ['67aadde8d9fad6d03cb36e83'],
        },
      },
    })
    .then((res) => {
      return res.docs
    })

  return (
    <Suspense fallback={<SkeletonShopHome />}>
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex-grow">
          <div className="space-y-24 py-12">
            <div className="container mx-auto px-4 z-0">
              <Carousel slides={carouselSlides} />
            </div>

            {/* Top Selling Products */}
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

            {/* Categories */}
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

            {/* Mineraluxe System */}
            <section className="container mx-auto px-4">
              <div className="bg-white rounded-3xl p-12">
                <div className="text-center mb-8">
                  <h3 className="text-gray-600 uppercase tracking-wide">Allow us to introduce</h3>
                  <h2 className="text-3xl font-bold text-[#1e365c] mt-2">
                    The Mineraluxe Hot Tub Care System
                  </h2>
                  <p className="text-gray-600 mt-2">advanced hot tub care</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="relative">
                    <Image
                      src="/mineraluxe.jpg"
                      alt="Mineraluxe Hot Tub Care System"
                      width={600}
                      height={600}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-8">
                    {mineraluxeSteps.map((step) => (
                      <div key={step.number} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e8f1f5] flex items-center justify-center text-[#1e365c] font-bold">
                          {step.number}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1e365c] text-lg">{step.title}</h3>
                          <p className="text-gray-600 mt-1">{step.description}</p>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full md:w-auto bg-[#1e365c] hover:bg-[#2a4a7c]">
                      SHOP NOW!
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
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
                      Our team of pool and spa experts are here to help you make the best choices
                      for your needs.
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
        </div>
      </div>
    </Suspense>
  )

  // return (
  //   <Fragment>
  //     {products.map((product) => (
  //       <TestClient key={product.id} product={product} />
  //     ))}
  //     {/* <RenderHero {...page.hero} /> */}
  //     {/* <RenderBlocks blocks={page.layout} /> */}
  //     {/* Hero Section */}
  //     {/* <section className="relative w-full py-24 md:py-32 lg:py-48 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-800">
  //       <div className="absolute inset-0 bg-[url('/hero-background.jpg')] bg-cover bg-center opacity-20"></div>
  //       <div className="container relative px-4 md:px-6 z-10">
  //         <div className="flex flex-col items-center space-y-8 text-center">
  //           <div className="space-y-4">
  //             <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white">
  //               BonaVista Leisurescapes
  //             </h1>
  //             <p className="mx-auto max-w-[700px] text-xl text-blue-100 md:text-2xl">
  //               Your one-stop shop for premium water care solutions and spa accessories
  //             </p>
  //           </div>
  //           <div className="space-x-4">
  //             <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
  //               <Link href="/store/water-care">Shop Water Care</Link>
  //             </Button>
  //             <Button
  //               size="lg"
  //               variant="outline"
  //               className="text-white border-white hover:bg-white/10"
  //             >
  //               <Link href="/guide/water-care">Water Care Guide</Link>
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
  //     </section> */}

  //     {/* Featured Products Section */}
  //     {/* <section className="w-full py-16 md:py-24 bg-white">
  //       <div className="container px-4 md:px-6">
  //         <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
  //           Featured Product Lines
  //         </h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  //           {[
  //             {
  //               name: 'Essential Care Kits',
  //               icon: SparklesIcon,
  //               color: 'bg-green-100 text-green-600',
  //             },
  //             {
  //               name: 'Luxury Spa Solutions',
  //               icon: DropletIcon,
  //               color: 'bg-purple-100 text-purple-600',
  //             },
  //             {
  //               name: 'Eco-Friendly Range',
  //               icon: BeakerIcon,
  //               color: 'bg-yellow-100 text-yellow-600',
  //             },
  //             {
  //               name: 'Professional Series',
  //               icon: SparklesIcon,
  //               color: 'bg-red-100 text-red-600',
  //             },
  //           ].map((product) => (
  //             <Card
  //               key={product.name}
  //               className="group hover:shadow-lg transition-shadow duration-300"
  //             >
  //               <CardHeader>
  //                 <div
  //                   className={`w-12 h-12 rounded-full ${product.color} flex items-center justify-center mb-4`}
  //                 >
  //                   <product.icon className="w-6 h-6" />
  //                 </div>
  //                 <CardTitle>{product.name}</CardTitle>
  //               </CardHeader>
  //               <CardContent>
  //                 <p className="text-muted-foreground">
  //                   Discover our premium selection for ultimate water care.
  //                 </p>
  //               </CardContent>
  //               <CardFooter>
  //                 <Button variant="ghost" className="group-hover:text-primary">
  //                   <Link
  //                     href={`/products/${product.name.toLowerCase().replace(' ', '-')}`}
  //                     className="flex items-center"
  //                   >
  //                     Shop Now
  //                     <ChevronRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
  //                   </Link>
  //                 </Button>
  //               </CardFooter>
  //             </Card>
  //           ))}
  //         </div>
  //       </div>
  //     </section> */}

  //     {/* Seasonal Promotion Section */}
  //     {/* <section className="w-full py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
  //       <div className="container px-4 md:px-6">
  //         <div className="flex flex-col md:flex-row items-center justify-between gap-8">
  //           <div className="text-center md:text-left space-y-4">
  //             <h2 className="text-3xl font-bold">Summer Splash Sale!</h2>
  //             <p className="text-xl text-blue-100">
  //               Dive into savings with up to 30% off on selected summer essentials.
  //             </p>
  //           </div>
  //           <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
  //             <Link href="/summer-sale">Shop Summer Deals</Link>
  //           </Button>
  //         </div>
  //       </div>
  //     </section> */}

  //     {/* Categories Section */}
  //     {/* <section className="w-full py-16 md:py-24 bg-gray-50">
  //       <div className="container px-4 md:px-6">
  //         <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
  //           Water Care Categories
  //         </h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  //           {[
  //             'Hot Tub Chemicals',
  //             'Swim Spa Solutions',
  //             'Filtration Systems',
  //             'Testing Kits',
  //             'Cleaning Accessories',
  //             'Eco-Friendly Options',
  //           ].map((category) => (
  //             <Card
  //               key={category}
  //               className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
  //             >
  //               <div className="h-48 bg-blue-200 relative overflow-hidden">
  //                 <img
  //                   src={`/category-${category.toLowerCase().replace(' ', '-')}.jpg`}
  //                   alt={category}
  //                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
  //                 />
  //               </div>
  //               <CardHeader>
  //                 <CardTitle>{category}</CardTitle>
  //               </CardHeader>
  //               <CardContent>
  //                 <p className="text-muted-foreground">
  //                   Explore our range of premium {category.toLowerCase()} for crystal clear water.
  //                 </p>
  //               </CardContent>
  //               <CardFooter>
  //                 <Button variant="ghost" className="group-hover:text-primary">
  //                   <Link
  //                     href={`/category/${category.toLowerCase().replace(' ', '-')}`}
  //                     className="flex items-center"
  //                   >
  //                     View Products
  //                     <ChevronRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
  //                   </Link>
  //                 </Button>
  //               </CardFooter>
  //             </Card>
  //           ))}
  //         </div>
  //       </div>
  //     </section> */}

  //     {/* Deals Section */}
  //     {/* <section className="w-full py-12 bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
  //       <div className="container px-4 md:px-6">
  //         <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
  //           <div className="text-center md:text-left">
  //             <h2 className="text-3xl font-bold mb-2">Limited Time Offer!</h2>
  //             <p className="text-xl text-blue-100">Get 20% off on all water testing kits</p>
  //           </div>
  //           <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
  //             <Link href="/deals">Shop Deals</Link>
  //           </Button>
  //         </div>
  //       </div>
  //     </section> */}
  //   </Fragment>
  // )
}
