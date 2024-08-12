import React from 'react'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/layout/link'
import { Media } from '@/components/layout/media'
import RichText from '@/components/layout/rich-text'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="">
      <div className="container mb-8">
        <RichText className="mb-6" content={richText || []} enableGutter={false} />
        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink
                    {...link}
                    url={link.url || undefined}
                    newTab={link.newTab || undefined}
                    reference={
                      link.reference as { relationTo: 'pages' | 'posts'; value: string | number }
                    }
                    type={link.type as 'reference' | 'custom'}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className="container ">
        {typeof media === 'object' && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName=""
              priority
              resource={media ?? undefined}
            />
            {media?.caption && (
              <div className="mt-3">
                <RichText content={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
