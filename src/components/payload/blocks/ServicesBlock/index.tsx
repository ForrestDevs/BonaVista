import React from 'react'
import type { ServicesBlockProps } from './types'
import { CMSLink } from '@/components/payload/Link'
import { Media } from '../../Media'
import { cn } from '@/lib/utils/cn'

export const ServicesBlock: React.FC<
  ServicesBlockProps & {
    id?: string
  }
> = (props) => {
  const { id, title, subtitle, body, link, offerings } = props

  return (
    <section className="w-full container py-8 sm:py-12" id={`block-${id}`}>
      <div className="px-4 sm:px-0">
        <h3 className="text-sm md:text-base font-light tracking-wider uppercase text-primary mb-3 md:mb-4">
          {subtitle}
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight tracking-tight">
          {title}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <p className="text-base md:text-lg leading-relaxed text-gray-700 max-w-3xl">{body}</p>
          <div className="shrink-0">
            <CMSLink
              {...link}
              className={cn(
                'transition-all duration-200',
                'hover:translate-y-[-2px] hover:shadow-lg',
              )}
              size="lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
          {offerings.map((offering, index) => (
            <OfferingCard key={index} offering={offering} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface OfferingCardProps {
  offering: ServicesBlockProps['offerings'][0]
}

function OfferingCard({ offering }: OfferingCardProps) {
  return (
    <div className="w-full max-w-[400px] sm:max-w-none relative aspect-3/4 max-h-[400px] rounded-xl overflow-hidden group transform transition-transform duration-200 hover:scale-[1.01] shadow-md hover:shadow-lg">
      <Media
        resource={offering.image}
        fill
        imgClassName="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{offering.title}</h3>
        <p className="text-sm md:text-base text-gray-100 mb-5 line-clamp-3">
          {offering.description}
        </p>
        <CMSLink
          {...offering.link}
          className={cn(
            'transition-colors duration-200 hover:shadow-lg',
            'bg-primary hover:bg-primary/90',
            'text-white',
          )}
          size="lg"
        />
      </div>
    </div>
  )
}
