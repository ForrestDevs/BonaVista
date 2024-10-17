import React from 'react'
import { ProductCategory } from '@payload-types'
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@components/ui/card'
import { TagIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@components/ui/button'
import { ChevronRightIcon } from 'lucide-react'

export default function ProductCategoryCard({ category }: { category: ProductCategory }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div
          className={`w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4`}
        >
          <TagIcon className="w-6 h-6" />
        </div>
        <CardTitle>{category.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {category.description || 'Explore our specialized range of products in this category.'}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="group-hover:text-primary">
          <Link href={`/shop/category/${category.slug}`} className="flex items-center">
            View Category
            <ChevronRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
