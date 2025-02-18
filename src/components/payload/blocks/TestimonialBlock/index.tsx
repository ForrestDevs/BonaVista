import React from 'react'
import type { TestimonialBlockProps } from './types'
import { cn } from '@/lib/utils/cn'
import { CMSLink } from '../../Link'
import { TestimonialsCarousel } from './client'
import getPayload from '@/lib/utils/getPayload'
import { TESTIMONIALS_SLUG } from '@/payload/collections/constants'
import { Testimonial } from '@payload-types'

export const TestimonialBlock: React.FC<
  TestimonialBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, limit: limitFromProps, populateBy, selectedDocs, title, body, link } = props
  const limit = limitFromProps || 3

  let testimonials: Testimonial[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload()

    const fetchedTestimonies = await payload.find({
      collection: TESTIMONIALS_SLUG,
      depth: 1,
      limit,
    })

    testimonials = fetchedTestimonies.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedTestimonials = selectedDocs.map((testimonial) => {
        if (typeof testimonial.value === 'object') return testimonial.value
      }) as Testimonial[]

      testimonials = filteredSelectedTestimonials
    }
  }

  return (
    <section className="w-full container py-8 sm:py-12" id={`block-${id}`}>
      <div className="px-4 sm:px-0">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4 md:mb-6">
              {title}
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-4 md:mb-6">
              {body}
            </p>
            <CMSLink
              {...link}
              className={cn(
                'transition-all duration-200',
                'hover:translate-y-[-2px] hover:shadow-lg',
              )}
              size="lg"
            />
          </div>

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  )
}
