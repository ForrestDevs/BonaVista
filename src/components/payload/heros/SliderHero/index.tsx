'use client'

import React from 'react'
import type { Page } from '@payload-types'
import { CMSLink } from '@components/payload/Link'
import { Media } from '@components/payload/Media'
import Fade from 'embla-carousel-fade'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'

export const SliderHero: React.FC<Page['hero']> = ({ slides, autoplay, fade, delay }) => {
  const plugin = React.useRef(Autoplay({ delay: delay || 6000, stopOnInteraction: false }))

  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        ...(autoplay ? [plugin.current] : []),
        ...(fade ? [Fade()] : [])
      ]}
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
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="relative z-10 text-left text-white max-w-3xl ml-12 md:ml-24 lg:ml-40">
                <p className="text-lg md:text-xl font-thin mb-2">{slide.pretitle}</p>
                <h1 className="text-5xl md:text-6xl mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-6">{slide.description}</p>
                {slide.links.map((link, index) => (
                  <CMSLink
                    key={index}
                    {...link.link}
                    className="rounded-none"
                    size="lg"
                    appearance="default"
                  />
                ))}
              </div>
            </section>
          </CarouselItem>
        ))}
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
  )
}
