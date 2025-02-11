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
    <section className={cn('py-12 container')} id={`block-${id}`}>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-700 mb-6">{body}</p>
          <CMSLink {...link} className="rounded-none" />
        </div>

        <TestimonialsCarousel testimonials={testimonials} />
      </div>
    </section>
  )
}
