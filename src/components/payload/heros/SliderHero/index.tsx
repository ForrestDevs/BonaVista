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
              <div className="relative z-10 text-left text-white max-w-[90%] w-full mx-auto lg:max-w-[80%] xl:max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <p className="text-base sm:text-lg font-light tracking-wider uppercase mb-3 sm:mb-4">
                  {slide.pretitle}
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 leading-[1.1] tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl leading-relaxed mb-6 sm:mb-8 max-w-4xl">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {slide.links.map((link, index) => (
                    <CMSLink
                      key={index}
                      {...link.link}
                      className="transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
                      size="lg"
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
