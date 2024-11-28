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
    <section className="container py-24">
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <p className="text-md font-medium text-primary tracking-wide">{preTitle}</p>
        <h2 className="text-4xl font-medium tracking-tight sm:text-5xl">{title}</h2>
        {body && (
          <div className="mx-auto max-w-3xl text-lg text-muted-foreground">
            <RichText content={body} />
          </div>
        )}
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {spasToShow.map((spa) => (
          <Card
            key={spa.id}
            className="max-w-sm mx-auto overflow-hidden transition-all hover:shadow-lg"
          >
            <CardContent className="p-6 space-y-6">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                {spa.thumbnail && (
                  <Link href={`/shop-hot-tubs/${spa.slug}`}>
                    <Media
                      resource={spa.thumbnail}
                      imgClassName="object-cover transition-transform hover:scale-105"
                    />
                  </Link>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-bold tracking-tight text-center">
                  {spa.title}
                  <span className="text-muted-foreground">™</span>
                </h3>
                <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
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
          <Button asChild size="lg">
            <Link href={link.url || '#'}>{link.label}</Link>
          </Button>
        </div>
      )}
    </section>
  )
}
