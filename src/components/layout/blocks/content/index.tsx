import React from 'react'

import { cn } from '@/lib/utils/cn'
import RichText from '@/components/layout/rich-text'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/layout/link'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  {
    id?: string
  } & Props
> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size ?? 'full']}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                <RichText content={richText || []} enableGutter={false} />
                {enableLink && (
                  <CMSLink
                    {...link}
                    url={link?.url || undefined}
                    newTab={link?.newTab || false}
                    reference={
                      link?.reference as { relationTo: 'pages' | 'posts'; value: string | number }
                    }
                    type={link?.type as 'reference' | 'custom'}
                  />
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
