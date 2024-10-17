import React from 'react'
import type { ServicesBlockProps } from './types'
import { CMSLink } from '@/components/payload/Link'
import { Media } from '../../Media'

export const ServicesBlock: React.FC<
  ServicesBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, title, offerings } = props

  return (
    <div className="py-16" id={`block-${id}`}>
      <div className="container mx-auto px-8">
        <h2 className="text-4xl font-light text-center mb-16 text-charcoal">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((offering) => (
            <OfferingCard key={offering.id} offering={offering} />
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
    // <CMSLink {...offering.link} >

    // </CMSLink>
    <div className="group relative overflow-hidden">
      {/* <img
          src={image}
          alt={title}
          className="w-full h-[600px] object-cover transition duration-300 group-hover:scale-105"
        /> */}
      <Media
        resource={offering.image}
        className="w-full h-[600px] object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h3 className="text-3xl font-light mb-2">{offering.title}</h3>
          <p className="text-sm opacity-0 group-hover:opacity-100 transition duration-300 delay-100">
            {offering.description}
          </p>
        </div>
      </div>
    </div>
  )
}
