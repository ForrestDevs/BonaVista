'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/layout/link'
import { Media } from '@/components/layout/media'
import RichText from '@/components/layout/rich-text'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="relative -mt-[10.4rem] flex items-end text-white">
      <div className="container mb-8 z-10 relative">
        <div className="max-w-[34rem]">
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
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <React.Fragment>
            <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
            <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
