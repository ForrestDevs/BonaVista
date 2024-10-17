import React from 'react'
import { ShopCollection } from '@payload-types'
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@components/ui/card'
import { SparklesIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@components/ui/button'
import { ChevronRightIcon } from 'lucide-react'

export default function ProductCollectionCard({ collection }: { collection: ShopCollection }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div
          className={`w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4`}
        >
          <SparklesIcon className="w-6 h-6" />
        </div>
        <CardTitle>{collection.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {collection.description || 'Discover our premium selection for ultimate water care.'}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="group-hover:text-primary">
          <Link href={`/shop/collection/${collection.slug}`} className="flex items-center">
            Shop Now
            <ChevronRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
