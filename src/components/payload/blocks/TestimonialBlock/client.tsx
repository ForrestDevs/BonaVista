'use client'

import React from 'react'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Testimonial } from '@payload-types'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { cn } from '@lib/utils/cn'

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full lg:w-1/2" // Fixed height to show 2 cards
      orientation={useMediaQuery('(min-width: 1024px)') ? 'vertical' : 'horizontal'}
    >
      <CarouselContent className="lg:h-[450px]">
        {testimonials.map((testimonial, index) => (
          <CarouselItem
            key={index}
            className="ml-1 basis-full lg:basis-1/2" // Show 2 cards vertically on lg screens
          >
            <div className="p-1 h-full">
              <Card className="h-full bg-gray-100 p-6 rounded-lg relative">
                <div className="text-4xl text-gray-300 absolute top-2 left-2">"</div>
                <CardContent className="flex flex-col justify-between p-6 h-full">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{testimonial.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-4">{testimonial.content}</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-4 h-4',
                            i < testimonial.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300',
                          )}
                        />
                      ))}
                    </div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.date}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
