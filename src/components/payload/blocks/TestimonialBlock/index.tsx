import React from 'react'
import type { TestimonialBlockProps } from './types'
import { cn } from '@/lib/utils/cn'
import { CMSLink } from '../../Link'
import { TestimonialsCarousel } from './client'
import getPayload from '@/lib/utils/getPayload'
import { TESTIMONIALS_SLUG } from '@/payload/collections/constants'
import { Testimonial } from '@payload-types'


const testimonialsSeed = [
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
