import React from 'react'
import type { Page } from '@payload-types'
import { CMSLink } from '@components/payload/Link'
import { Media } from '@components/payload/Media'
import RichText from '@components/payload/RichText'
import Image from 'next/image'
import clsx from 'clsx'

export const StandardHero: React.FC<Page['hero']> = ({ title, subtitle, background, size }) => {
  return (
    <section
      className={clsx(
        'relative flex items-center justify-center',
        size === 'small' && 'min-h-[400px]',
        size === 'medium' && 'min-h-[600px]',
        size === 'large' && 'min-h-[800px]',
      )}
    >
      <Media
        resource={background}
        fill
        priority
        imgClassName="object-cover object-center"
        className="absolute inset-0"
      />

      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white max-w-4xl mx-4 sm:mx-8 md:mx-12 lg:mx-24 xl:mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 md:mb-4 lg:mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light uppercase tracking-wider sm:tracking-widest max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
