import type { Page } from '@payload-types'

export type TestimonialBlockProps = Extract<Page['layout'][0], { blockType: 'testimonials' }>
