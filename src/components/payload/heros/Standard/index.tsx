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
      <Media resource={background} fill priority imgClassName="object-cover object-center" />

      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-lg md:text-xl font-light uppercase tracking-widest">{subtitle}</p>
      </div>
    </section>
  )
}
