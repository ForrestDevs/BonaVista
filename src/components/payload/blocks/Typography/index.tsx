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
    id,
  } = props

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const baseContainerClasses = 'max-w-[85ch] py-8 md:py-0'
  const subtitleClasses = cn(
    'text-sm md:text-base font-light tracking-wider uppercase',
    'mb-3 md:mb-4',
    alignClasses[align],
    subtitleFontColor || 'text-primary',
  )
  const titleClasses = cn(
    'text-3xl md:text-4xl lg:text-5xl font-bold',
    'leading-tight tracking-tight',
    'mb-6 md:mb-8',
    alignClasses[align],
    titleFontColor || 'text-gray-900',
  )
  const bodyClasses = cn(
    'text-base md:text-lg leading-relaxed',
    'mb-8 md:mb-10',
    alignClasses[align],
    bodyFontColor || 'text-gray-700',
  )

  const shouldShowSubtitle = ['sub-title-body', 'subtitle'].includes(type)
  const shouldShowTitle = ['sub-title-body', 'title-body', 'title'].includes(type)
  const shouldShowBody = ['sub-title-body', 'title-body', 'body'].includes(type)

  return (
    <section className="w-full" id={`block-${id}`}>
      <div className={baseContainerClasses}>
        {shouldShowSubtitle && <h3 className={subtitleClasses}>{subTitle}</h3>}
        {shouldShowTitle && <h2 className={titleClasses}>{title}</h2>}
        {shouldShowBody && (
          <RichText content={body} enableGutter={false} enableProse className={bodyClasses} />
        )}

        {links?.length > 0 && (
          <div
            className={cn(
              'flex flex-col sm:flex-row gap-4',
              'mt-6 md:mt-8',
              align === 'center' && 'justify-center',
              align === 'right' && 'justify-end',
              align === 'left' && 'justify-start',
            )}
          >
            {links.map((link, i) => (
              <CMSLink
                key={i}
                {...link.link}
                className={cn(
                  'transition-all duration-200',
                  'hover:translate-y-[-2px] hover:shadow-lg',
                  'bg-primary hover:bg-primary/90',
                  'text-white',
                )}
                size="lg"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
