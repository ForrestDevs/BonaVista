import React from 'react'

import RichText from '@/components/layout/rich-text'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/layout/link'

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CallToActionBlock: React.FC<
  Props & {
    id?: string
  }
> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          <RichText className="" content={richText || []} enableGutter={false} />
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return (
              <CMSLink
                key={i}
                size="lg"
                {...link}
                url={link.url || undefined}
                newTab={link.newTab || false}
                reference={
                  link.reference as { relationTo: 'pages' | 'posts'; value: string | number }
                }
                type={link.type as 'reference' | 'custom'}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
