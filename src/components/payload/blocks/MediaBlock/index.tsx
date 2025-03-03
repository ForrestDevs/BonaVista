import type { StaticImageData } from 'next/image'

import { cn } from '@lib/utils/cn'
import React from 'react'
import RichText from '@components/payload/RichText'

import type { Page } from '@payload-types'

import { Media } from '@components/payload/Media'

type Props = Extract<Page['layout'][0], { blockType: 'mediaBlock' }> & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  id?: string
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    position = 'default',
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <div
      className={cn(
        'w-full',
        {
          'container mx-auto px-4': position === 'default' && enableGutter,
        },
        className
      )}
    >
      {position === 'fullscreen' && (
        <div className="relative w-full">
          <div className="aspect-16/9 md:aspect-21/9">
            <Media 
              resource={media} 
              src={staticImage}
              imgClassName="object-cover"
            />
          </div>
        </div>
      )}
      {position === 'default' && (
        <div className="relative w-full overflow-hidden rounded-lg">
          <div className="aspect-4/3 md:aspect-16/9">
            <Media 
              resource={media} 
              src={staticImage}
              imgClassName={cn(
                'object-cover transition-transform duration-300 hover:scale-105',
                imgClassName
              )}
            />
          </div>
        </div>
      )}
      {caption && (
        <div
          className={cn(
            'mt-4 text-sm text-gray-600',
            {
              'container mx-auto px-4': position === 'fullscreen' && !disableInnerContainer,
            },
            captionClassName
          )}
        >
          <RichText content={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
