import React from 'react'
import configPromise from '@payload-config'
import type { Testimonial } from '@payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import RichText from '@components/payload/RichText'
import type { TestimonialBlockProps } from './types'
import { TESTIMONIALS_SLUG } from '@/payload/collections/constants'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export const TestimonialBlock: React.FC<
  TestimonialBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  //   let testimonials: Testimonial[] = []

  //   if (populateBy === 'collection') {
  //     const payload = await getPayloadHMR({ config: configPromise })

  //     const fetchedTestimonies = await payload.find({
  //       collection: TESTIMONIALS_SLUG,
  //       depth: 1,
  //       limit,
  //     })

  //     testimonials = fetchedTestimonies.docs
  //   } else {
  //     if (selectedDocs?.length) {
  //       const filteredSelectedTestimonials = selectedDocs.map((testimonial) => {
  //         if (typeof testimonial.value === 'object') return testimonial.value
  //       }) as Testimonial[]

  //       testimonials = filteredSelectedTestimonials
  //     }
  //   }
  const testimonials = [
    {
      title: 'Exceptional Service',
      content:
        "I've been using this product for months now, and I'm continually impressed by its performance and reliability. The customer support team is always quick to respond and incredibly helpful. It's rare to find a company that values its customers this much.",
      author: 'John Doe',
      rating: 5,
      date: 'May 15, 2023',
    },
    {
      title: 'Game-Changing Product',
      content:
        "This solution has revolutionized our workflow. We've seen a 40% increase in productivity since implementing it. The intuitive interface and powerful features make it a must-have for any serious business.",
      author: 'Jane Smith',
      rating: 5,
      date: 'June 3, 2023',
    },
    {
      title: 'Solid Performance',
      content:
        "While there's room for improvement in some areas, overall, this product delivers on its promises. It's been a reliable part of our tech stack for the past year. The recent updates have addressed most of our initial concerns.",
      author: 'Alex Johnson',
      rating: 4,
      date: 'July 22, 2023',
    },
    {
      title: 'Great Value for Money',
      content:
        "I was skeptical at first, but this product has proven its worth many times over. The features you get for the price point are unmatched in the market. It's not perfect, but it's pretty close.",
      author: 'Sarah Williams',
      rating: 4,
      date: 'August 9, 2023',
    },
    {
      title: 'Continuous Improvement',
      content:
        "What impresses me most is how the product keeps evolving. The development team clearly listens to user feedback. Each update brings meaningful improvements. It's exciting to see what new features will come next.",
      author: 'Michael Brown',
      rating: 5,
      date: 'September 14, 2023',
    },
  ]

  const cardsToShow = 4

  return (
    <section className={cn('py-12 container')} {...props} id={`block-${id}`}>
      <div className="max-w-6xl mx-auto">
        {introContent && (
          <div className="mb-16">
            <RichText className="ml-0 max-w-[48rem]" content={introContent} enableGutter={false} />
          </div>
        )}
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className={`pl-2 md:pl-4 basis-full md:basis-1/${cardsToShow}`}
              >
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex flex-col justify-between p-6 h-full">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{testimonial.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-4">
                          {testimonial.content}
                        </p>
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
          {/* <CarouselPrevious />
          <CarouselNext /> */}
        </Carousel>
      </div>
    </section>

    // <div className="my-16 container" >
    //   {introContent && (
    //     <div className="container mb-16">
    //       <RichText className="ml-0 max-w-[48rem]" content={introContent} enableGutter={false} />
    //     </div>
    //   )}
    //   <div className="flex justify-center">
    //     <Carousel className="w-full">
    //       <CarouselContent>
    //         {testimonials.map((item, index) => (
    //           <CarouselItem key={index}>
    //             <div className="p-1">
    //               <Card className="p-4 rounded-md">
    //                 <CardTitle>{item.title}</CardTitle>
    //                 <CardContent className="flex aspect-square items-center justify-center p-6">
    //                   {item.description}
    //                 </CardContent>
    //                 <CardFooter>{item.reviewer}</CardFooter>
    //               </Card>
    //             </div>
    //           </CarouselItem>
    //         ))}
    //       </CarouselContent>
    //       <CarouselPrevious />
    //       <CarouselNext />
    //     </Carousel>
    //   </div>
    // </div>
  )
}
