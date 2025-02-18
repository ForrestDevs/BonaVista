'use client'

import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/payload/Media'
import RichText from '@/components/payload/RichText'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'
import type { FeaturedSpasBlockProps } from './types'
import { Spa } from '@payload-types'

export const FeaturedSpas: React.FC<FeaturedSpasBlockProps> = ({
  preTitle,
  title,
  body,
  spas,
  link,
}) => {
  let spasToShow: Spa[] = []

  if (spas?.length) {
    const filteredSpas = spas.map((spa) => {
      if (typeof spa === 'object') return spa
    })

    spasToShow = filteredSpas
  }
  return (
    <section className="w-full">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col items-center text-center gap-4 mb-8 md:mb-12">
          {preTitle && (
            <p className="text-sm md:text-base font-light tracking-wider uppercase text-primary">
              {preTitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            {title}
          </h2>
          {body && (
            <div className="max-w-[85ch] text-base md:text-lg leading-relaxed text-gray-700">
              <RichText content={body} enableGutter={false} />
            </div>
          )}
        </div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 md:mb-12">
          {spasToShow.map((spa) => (
            <Card
              key={spa.id}
              className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px]"
            >
              <CardContent className="p-6 space-y-6">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  {spa.thumbnail && (
                    <Link href={`/shop-hot-tubs/${spa.slug}`}>
                      <Media
                        resource={spa.thumbnail}
                        imgClassName="object-cover transition-transform duration-200 hover:scale-105"
                      />
                    </Link>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-center text-gray-900">
                    {spa.title}
                    <span className="text-gray-500">™</span>
                  </h3>
                  <div className="flex justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{spa.seating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {link && (
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
            >
              <Link href={link.url || '#'}>{link.label}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
