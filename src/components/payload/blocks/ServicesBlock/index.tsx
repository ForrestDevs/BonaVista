import React from 'react'
import type { ServicesBlockProps } from './types'
import { CMSLink } from '@/components/payload/Link'
import { Media } from '../../Media'

export const ServicesBlock: React.FC<
  ServicesBlockProps & {
    id?: string
  }
> = (props) => {
  const { id, title, subtitle, body, link, offerings } = props

  return (
    <div className="py-16" id={`block-${id}`}>
      <div className="container mx-auto px-8">
        <h3 className="text-sm font-thin tracking-widest text-gray-600 mb-2 uppercase">
          {subtitle}
        </h3>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="flex flex-col md:flex-row md:items-end md:justify-start mb-6">
          <p className="text-gray-700 md:mb-0 max-w-2xl">{body}</p>
          <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
            <CMSLink {...link} className="rounded-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {offerings.map((offering, index) => (
            <OfferingCard key={index} offering={offering} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface OfferingCardProps {
  offering: ServicesBlockProps['offerings'][0]
}

function OfferingCard({ offering }: OfferingCardProps) {
  return (
    <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden group">
      <Media
        resource={offering.image}
        fill
        imgClassName="object-cover"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 transition-opacity duration-300 opacity-100 group-hover:opacity-90">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">{offering.title}</h3>
        <p className="text-sm md:text-base text-white mb-4 line-clamp-3">{offering.description}</p>
        <CMSLink {...offering.link} className="rounded-none" />
      </div>
    </div>
  )
}
{
  /* <Button variant="default" size="sm" asChild className="self-start rounded-none">
                  //{' '}
                  <Link href={product.href} className="text-white hover:text-black">
                    // Learn More //{' '}
                  </Link>
                  //{' '}
                </Button> */
}
