'use client'

import React from 'react'
import type { Page } from '@payload-types'
import { CMSLink } from '@components/payload/Link'
import { Media } from '@components/payload/Media'
import Fade from 'embla-carousel-fade'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselItem, CarouselContent, CarouselDots } from '@/components/ui/carousel'

export const SliderHero: React.FC<Page['hero']> = ({ slides, autoplay, fade, delay }) => {
  const plugin = React.useRef(Autoplay({ delay: delay || 6000, stopOnInteraction: false }))

  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[...(autoplay ? [plugin.current] : []), ...(fade ? [Fade()] : [])]}
      className="relative w-full"
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <section className="relative flex items-center justify-start min-h-[95vh]">
              <Media
                resource={slide.background}
                fill
                priority
                imgClassName="object-cover object-center"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="relative z-10 text-left text-white max-w-3xl mx-4 sm:mx-8 md:mx-12 lg:mx-24 xl:mx-40">
                <p className="text-base sm:text-lg md:text-xl font-thin mb-2 md:mb-3">
                  {slide.pretitle}
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 max-w-2xl">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {slide.links.map((link, index) => (
                    <CMSLink
                      key={index}
                      {...link.link}
                      className="rounded-none w-full sm:w-auto text-center"
                      size="lg"
                      appearance="default"
                    />
                  ))}
                </div>
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 scale-150 text-white"
        buttonClassName="hover:after:bg-gray-600"
        selectedClassName="after:bg-blue-500 hover:after:bg-gray-600"
      />
    </Carousel>
  )
}
