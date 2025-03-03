import { cn } from '@lib/utils/cn'
import React from 'react'
import RichText from '@components/payload/RichText'

import type { Page } from '@payload-types'

import { CMSLink } from '@components/payload/Link'
import { RenderBlocks } from '..'
import { Media } from '@components/payload/Media'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  {
    id?: string
  } & Props
> = (props) => {
  const { columns, gapX, gapY, id } = props

  const colsSpanClasses = {
    full: 'lg:col-span-12',
    half: 'lg:col-span-6',
    oneThird: 'lg:col-span-4',
    twoThirds: 'lg:col-span-8',
  }

  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  }

  return (
    <section className="w-full container py-8 sm:py-12" id={`block-${id}`}>
      <div className="px-4 sm:px-0">
        <div
          className={cn(
            'grid grid-cols-4 lg:grid-cols-12',
            { 'gap-y-[32px]': gapY },
            { 'gap-x-[32px]': gapX },
          )}
        >
          {columns &&
            columns.length > 0 &&
            columns.map((col, index) => {
              const {
                enableLink,
                link,
                richText,
                size,
                blocks,
                enableBackgroundImage,
                backgroundImage,
                align,
                height,
              } = col

              return (
                <div
                  className={cn('relative col-span-4', colsSpanClasses[size!], {
                    'md:col-span-2': size !== 'full',
                  })}
                  style={{
                    minHeight: height ? `${height}px` : '',
                  }}
                  key={index}
                >
                  {enableBackgroundImage && backgroundImage && (
                    <>
                      <Media
                        resource={backgroundImage}
                        fill
                        imgClassName="object-cover object-center"
                        className="absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 z-20"></div>
                    </>
                  )}

                  <div
                    className={cn(
                      'relative z-30 flex flex-col h-full',
                      {
                        'p-8 lg:p-12': enableBackgroundImage,
                      },
                      align ? alignClasses[align] : '',
                    )}
                  >
                    {richText && <RichText content={richText} enableGutter={false} />}

                    {blocks && blocks.length > 0 && <RenderBlocks blocks={blocks} />}

                    {enableLink && <CMSLink {...link} className="rounded-none" />}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}
