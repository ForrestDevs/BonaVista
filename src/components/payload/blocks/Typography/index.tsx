import React from 'react'
import type { TypographyBlockProps } from './types'
import RichText from '../../RichText'
import { CMSLink } from '../../Link'
import { cn } from '@/lib/utils/cn'

export const TypographyBlock: React.FC<
  TypographyBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    type,
    subTitle,
    title,
    body,
    align,
    links,
    subtitleFontColor,
    titleFontColor,
    bodyFontColor,
  } = props

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  let content

  switch (type) {
    case 'sub-title-body':
      content = (
        <div>
          <h3
            className={cn(
              'text-sm font-light tracking-widest mb-2 uppercase',
              alignClasses[align],
              subtitleFontColor ? subtitleFontColor : 'text-gray-600',
            )}
          >
            {subTitle}
          </h3>
          <h2
            className={cn(
              'text-3xl lg:text-4xl font-bold mb-4',
              alignClasses[align],
              titleFontColor ? titleFontColor : 'text-gray-900',
            )}
          >
            {title}
          </h2>
          <RichText
            content={body}
            enableGutter={false}
            enableProse
            className={cn(
              'mb-4',
              alignClasses[align],
              bodyFontColor ? bodyFontColor : 'text-gray-700',
            )}
          />
        </div>
      )
      break
    case 'title-body':
      content = (
        <div>
          <h2
            className={cn(
              'text-3xl lg:text-4xl font-bold mb-4',
              alignClasses[align],
              titleFontColor ? titleFontColor : 'text-gray-900',
            )}
          >
            {title}
          </h2>
          <RichText
            content={body}
            enableGutter={false}
            enableProse
            className={cn(
              'mb-4',
              alignClasses[align],
              bodyFontColor ? bodyFontColor : 'text-gray-700',
            )}
          />
        </div>
      )
      break
    case 'title':
      content = (
        <h2
          className={cn(
            'text-3xl lg:text-4xl font-bold mb-4',
            alignClasses[align],
            titleFontColor ? titleFontColor : 'text-gray-900',
          )}
        >
          {title}
        </h2>
      )
      break
    case 'subtitle':
      content = (
        <h3
          className={cn(
            'text-sm font-light tracking-widest mb-2 uppercase',
            alignClasses[align],
            subtitleFontColor ? subtitleFontColor : 'text-gray-600',
          )}
        >
          {subTitle}
        </h3>
      )
      break
    case 'body':
      content = (
        <RichText
          content={body}
          enableGutter={false}
          enableProse
          className={cn(
            'mb-4',
            alignClasses[align],
            bodyFontColor ? bodyFontColor : 'text-gray-700',
          )}
        />
      )
      break
  }

  return (
    <>
      {content}
      {links?.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          {links.map((link, i) => (
            <CMSLink key={i} {...link.link} className="rounded-none" size="lg" />
          ))}
        </div>
      )}
    </>
  )
}
