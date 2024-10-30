'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import { cn } from '@lib/utils/cn'
import { Submenus } from '@/components/layout/headers/site/submenu'
import { Col, Grid } from '@/components/ui/grid'

export default function TestHome() {
  const plugin = React.useRef(Autoplay({ delay: 6000, stopOnInteraction: true }))

  const blogPosts = [
    {
      title: 'What Does An Infrared Sauna Do For Your Body? 5 Wellness Benefits',
      description:
        "Infrared saunas are becoming super popular, and for good reason! They don't just make you sweat—they help your body in",
      image: '/placeholder.svg?height=200&width=400',
    },
    {
      title: 'The Best Swim Spas Of 2024 - 5 Endless Pools® Swim Spas To Transform Your Backyard',
      description:
        'When it comes to enhancing your backyard with a versatile, high-quality swim spa, Endless Pools® stands out as a leader',
      image: '/placeholder.svg?height=200&width=400',
    },
    {
      title:
        'How To Find A Reliable Hot Tub Dealership - Celebrating 40 Years Serving Southern California',
      description:
        "Finding the perfect hot tub for your home is about more than just selecting the right model; it's about choosing",
      image: '/placeholder.svg?height=200&width=400',
    },
  ]

  const products = [
    {
      title: 'Hot Tubs',
      description:
        'Entertain, relax, and spend time with loved ones in the comfort of your home and backyard oasis.',
      href: '/hot-tubs',
      image: '/hottub.jpg',
    },
    {
      title: 'Swim Spas',
      description: 'The perfect adition to any home, family, and lifestyle.',
      href: '/swim-spas',
      image: '/swimspa.jpg',
    },
    {
      title: 'Outdoor Living',
      description:
        'Transform your backyard into a personal oasis with our outdoor living products.',
      href: '/outdoor-living',
      image: '/dekko.jpg',
    },
    {
      title: 'Water Care',
      description: 'Keep your spa clean and running smoothly with our water care products.',
      href: '/water-care',
      image: '/chems.webp',
    },
  ]

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  const alignClasses = {
    start: 'self-start',
    center: 'self-center',
    end: 'self-end',
  }

  const align = 'center'

  const columns = [
    {
      size: 'full',
      bgColor: 'red-500',
      content: (
        <div className="h-fit">
          <h3 className="text-sm font-light tracking-widest text-gray-600 mb-2 uppercase">
            WHO WE ARE
          </h3>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Welcome to BonaVista LeisureScapes
          </h2>
          <p className="text-gray-700 mb-6">
            BonaVista Leisurescapes is your premier destination for creating the ultimate outdoor
            living experience. With years of expertise in hot tubs, swim spas, and outdoor living,
            we're dedicated to transforming your backyard into a personal oasis. Our commitment to
            quality products and exceptional customer service ensures that your journey to
            relaxation and wellness is seamless and enjoyable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="default" size="lg" asChild className="rounded-none">
              <Link href="/about-us">Learn More About Us</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="rounded-none">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      ),
    },
    {
      size: 'half',
      bgColor: 'red-500',
      content: (
        <div className="h-fit">
          <h3 className="text-sm font-light tracking-widest text-gray-600 mb-2 uppercase">
            WHO WE ARE
          </h3>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Welcome to BonaVista LeisureScapes
          </h2>
          <p className="text-gray-700 mb-6">
            BonaVista Leisurescapes is your premier destination for creating the ultimate outdoor
            living experience. With years of expertise in hot tubs, swim spas, and outdoor living,
            we're dedicated to transforming your backyard into a personal oasis. Our commitment to
            quality products and exceptional customer service ensures that your journey to
            relaxation and wellness is seamless and enjoyable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="default" size="lg" asChild className="rounded-none">
              <Link href="/about-us">Learn More About Us</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="rounded-none">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      ),
    },
    {
      size: 'half',
      bgColor: 'blue-500',
      image: '/728.jpg',
    },
  ]

  const ygap = '8'
  const xgap = '8'

  return (
    <div>
      <section className="container w-full bg-white">
        <div
          className={cn('grid grid-cols-4 lg:grid-cols-12', {
            [`gap-y-${ygap}`]: ygap,
            [`gap-x-${xgap}`]: xgap,
          })}
        >
          {columns &&
            columns.length > 0 &&
            columns.map((col, index) => {
              const { size, bgColor, content, image } = col

              return (
                <div
                  className={cn(
                    `bg-${bgColor} self-center col-span-4 lg:col-span-${colsSpanClasses[size!]}`,
                    {
                      'md:col-span-2': size !== 'full',
                    },
                  )}
                  key={index}
                >
                  {content}
                  {image && (
                    <div className="relative w-full">
                      <Image
                        src={image}
                        width={1000}
                        height={1000}
                        alt="BonaVista Leisurescapes"
                        className="object-cover aspect-[4/3]"
                      />
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Column - Image */}
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/728.jpg"
                  alt="BonaVista Leisurescapes"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Right Column - Text Content */}
            <div className="w-full lg:w-1/2 lg:pl-12">
              <h3 className="text-sm font-light tracking-widest text-gray-600 mb-2 uppercase">
                WHO WE ARE
              </h3>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Welcome to BonaVista LeisureScapes
              </h2>
              <p className="text-gray-700 mb-6">
                BonaVista Leisurescapes is your premier destination for creating the ultimate
                outdoor living experience. With years of expertise in hot tubs, swim spas, and
                outdoor living, we're dedicated to transforming your backyard into a personal oasis.
                Our commitment to quality products and exceptional customer service ensures that
                your journey to relaxation and wellness is seamless and enjoyable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="default" size="lg" asChild className="rounded-none">
                  <Link href="/about-us">Learn More About Us</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild className="rounded-none">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[plugin.current, Fade()]}
        className="relative w-full"
      >
        <CarouselContent>
          <CarouselItem>
            <section className="relative flex items-center justify-start min-h-[95vh]">
              <Image
                src="/dew.jpg"
                alt="Hero image 1"
                fill
                priority
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="container relative z-10 text-left text-white max-w-3xl ml-8 md:ml-16 lg:ml-24">
                <p className="text-lg md:text-xl font-thin mb-2">Hot Tubs</p>
                <h1 className="text-5xl md:text-6xl mb-4">Create Your Own Personal Oasis</h1>
                <p className="text-lg md:text-xl mb-6">
                  Entertain, relax, and spend time with loved ones in the comfort of your home and
                  backyard oasis.
                </p>
                <Button variant="default" size="lg" className="rounded-none">
                  Explore Hot Tubs
                </Button>
              </div>
            </section>
          </CarouselItem>
          <CarouselItem>
            <section className="relative flex items-center justify-center min-h-[95vh]">
              <Image
                src="/ning.jpg"
                alt="Hero image 1"
                fill
                priority
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="container relative z-10 text-left text-white max-w-3xl ml-8 md:ml-16 lg:ml-24">
                <p className="text-lg md:text-xl font-thin mb-2">Swim Spas</p>
                <h1 className="text-5xl md:text-6xl mb-4">Enjoy Backyard Bliss With A Swim Spa</h1>
                <p className="text-lg md:text-xl mb-6">
                  The perfect adition to any home, family, and lifestyle.
                </p>
                <Button variant="default" size="lg" className="rounded-none">
                  Explore Swim Spas
                </Button>
              </div>
            </section>
          </CarouselItem>
          <CarouselItem>
            <section className="relative flex items-center justify-center min-h-[95vh]">
              <Image
                src="/mant.jpg"
                alt="Hero image 1"
                fill
                priority
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="container relative z-10 text-left text-white max-w-3xl ml-8 md:ml-16 lg:ml-24">
                <p className="text-lg md:text-xl font-thin mb-2">Outdoor Living</p>
                <h1 className="text-5xl md:text-6xl mb-4">Transform Your Backyard</h1>
                <p className="text-lg md:text-xl mb-6">
                  Relax by the fire or entertain with friends and family.
                </p>
                <Button variant="default" size="lg" className="rounded-none">
                  Explore Outdoor Living
                </Button>
              </div>
            </section>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious
          variant="none"
          className="absolute left-2 top-1/2 transform -translate-y-1/2"
        />
        <CarouselNext
          variant="none"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        />
      </Carousel>

      <Grid cols={1} colsMd={2} colsLg={4} className="container w-full gap-2 lg:px-8 mx-auto mt-2">
        <Col>
          <Card>
            <CardHeader>
              <CardTitle>Title</CardTitle>
            </CardHeader>
            <CardContent>KPI 1</CardContent>
          </Card>
        </Col>

        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>KPI 2</CardContent>
        </Card>

        <Col>
          <Card>
            <CardHeader>
              <CardTitle>Title</CardTitle>
            </CardHeader>
            <CardContent>KPI 3</CardContent>
          </Card>
        </Col>
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>KPI 4</CardContent>
        </Card>
      </Grid>

      <div className="container w-full lg:px-8 mt-2">
        <Grid cols={1} colsMd={2} colsLg={3} className="max-w-4xl mx-auto gap-2">
          <Col>
            <Card>
              <CardHeader>
                <CardTitle>Title</CardTitle>
              </CardHeader>
              <CardContent>KPI 1</CardContent>
            </Card>
          </Col>

          <Card>
            <CardHeader>
              <CardTitle>Title</CardTitle>
            </CardHeader>
            <CardContent>KPI 2</CardContent>
          </Card>

          <Col>
            <Card>
              <CardHeader>
                <CardTitle>Title</CardTitle>
              </CardHeader>
              <CardContent>KPI 3</CardContent>
            </Card>
          </Col>
        </Grid>
      </div>

      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-sm font-thin tracking-widest text-gray-600 mb-2 uppercase">
            Featured Products
          </h3>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything Backyard Leisure
          </h2>
          <div className="flex flex-col md:flex-row md:items-end md:justify-start mb-6">
            <p className="text-gray-700 md:mb-0 max-w-2xl">
              Discover our curated selection of premium products designed to transform your outdoor
              space into a personal paradise. From luxurious hot tubs to state-of-the-art swim spas,
              we have everything you need for the ultimate backyard experience.
            </p>
            <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
              <Button variant="default" size="lg" asChild className="rounded-none">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.title}
                className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden group"
              >
                <Image src={product.image} alt={product.title} layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 transition-opacity duration-300 opacity-100 group-hover:opacity-90">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm md:text-base text-white mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  <Button variant="default" size="sm" asChild className="self-start rounded-none">
                    <Link href={product.href} className="text-white hover:text-black">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
            {/* Left Column */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Our Customers Love Us
              </h2>
              <p className="text-gray-700 mb-6">
                Don't just take our word for it. Hear from our satisfied customers about their
                experiences with our products and services. We're proud to have helped so many
                people transform their outdoor spaces into personal paradises.
              </p>
              <Button variant="default" size="lg" asChild className="rounded-none">
                <Link href="/reviews">See All Reviews</Link>
              </Button>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-1/2 space-y-6">
              {[
                {
                  title: 'Life-changing purchase!',
                  body: "The hot tub we bought from Lifestyle Outdoor has completely transformed our evenings. It's the perfect way to unwind after a long day.",
                  rating: 5,
                },
                {
                  title: 'Exceptional service',
                  body: 'From selection to installation, the team at Lifestyle Outdoor was professional, knowledgeable, and incredibly helpful. Highly recommend!',
                  rating: 5,
                },
              ].map((review, index) => (
                <div key={index} className="bg-gray-100 p-6 rounded-lg relative">
                  <div className="text-4xl text-gray-300 absolute top-2 left-2">"</div>
                  <h3 className="text-xl font-semibold mb-2 mt-4">{review.title}</h3>
                  <p className="text-gray-600 mb-4">{review.body}</p>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column */}
            <div className="relative w-full lg:w-1/2 min-h-[400px] lg:min-h-[600px]">
              <Image
                src="/ning.jpg"
                alt="Outdoor spa on a wooden deck"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
              <div className="relative z-20 flex flex-col justify-center h-full p-8 lg:p-12">
                <h3 className="text-sm font-light tracking-widest text-white mb-2">OUR PROCESS</h3>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Find The Perfect Spa
                </h2>
                <p className="text-white mb-6">
                  Experience an invigorating hydromassage that increases your physical, emotional
                  and mental wellbeing. After ten minutes of hydrotherapy, you'll feel refreshed,
                  relaxed and rejuvenated. We can help you find the best spa for your lifestyle,
                  with some of the most innovative features and designs available to the industry.
                </p>
                <div className="inline-block">
                  <Link
                    href="/our-process"
                    className="inline-block bg-white text-black font-semibold py-2 px-6 hover:bg-opacity-90 transition-colors"
                  >
                    LEARN ABOUT OUR PROCESS
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative w-full lg:w-1/2 min-h-[400px] lg:min-h-[600px]">
              <Image
                src="/toronto.jpg"
                alt="Outdoor spa on a wooden deck"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
              <div className="relative z-20 flex flex-col justify-center h-full p-8 lg:p-12">
                <h3 className="text-sm font-light tracking-widest text-white mb-2">OUR SHOWROOM</h3>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Our Toronto Showroom
                </h2>
                <p className="text-white mb-6">
                  Our Toronto Showroom is the perfect place to explore our products and find the
                  perfect fit for your backyard.
                </p>
                <div className="inline-block">
                  <Link
                    href="/our-showroom"
                    className="inline-block bg-white text-black font-semibold py-2 px-6 hover:bg-opacity-90 transition-colors"
                  >
                    VIEW OUR SHOWROOM
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-sm font-thin tracking-widest text-gray-600 mb-2 uppercase">
            OUR BLOG
          </h3>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Read Our Latest News
          </h2>
          <div className="flex flex-col md:flex-row md:items-end md:justify-start mb-6">
            <p className="text-gray-700 md:mb-0 max-w-2xl">
              Read some of our most popular blogs covering a range of topics, from health and
              hydrotherapy to creating the perfect spa installation and more.
            </p>
            <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
              <Button variant="default" size="lg" asChild className="rounded-none">
                <Link href="/blog">VIEW OUR BLOGS</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden group"
              >
                <Image src={post.image} alt={post.title} layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 transition-opacity duration-300 opacity-100 group-hover:opacity-90">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm md:text-base text-white mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <Button variant="default" size="sm" asChild className="self-start rounded-none">
                    <Link href="#" className="text-white hover:text-black">
                      READ MORE »
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
