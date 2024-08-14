"use client"

import type { Metadata } from 'next'
import config from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import React, { cache } from 'react'
import type { Page as PageType } from '@/payload-types'
import { Blocks } from '@/components/layout/blocks/render'
import { generateMeta } from '@/lib/utils/generateMeta'
import { notFound } from 'next/navigation'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  ShoppingCartIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from 'lucide-react'
import { ProductCard } from '@/components/store/products/product-card'

type ProductVariant = {
  size: string
  price: number
  sku: string
}

type Product = {
  id: string
  name: string
  description: string
  longDescription: string
  images: string[]
  variants: ProductVariant[]
  specs: Record<string, string>
//   quickSteps: string[]
//   relatedResources: string[]
  reviews: Array<{ user: string; rating: number; comment: string }>
  relatedProducts: Array<{
    id: string
    name: string
    description: string
    price: number
    image: string
  }>
}

export default function ProductDetail() {
  const searchParams = useSearchParams()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Mock product data - in a real application, you'd fetch this based on the id
  const product: Product = {
    id: '1',
    name: 'PH+ Increaser',
    description: 'Raises the pH level of your spa water.',
    longDescription:
      "Our PH+ Increaser is specially formulated to safely raise the pH level of your spa or hot tub water. Maintaining the proper pH balance is crucial for bather comfort and equipment longevity. This premium product dissolves quickly and is highly effective in adjusting your water's pH to the ideal range.",
    images: [
      '/ph-increaser-1.jpg',
      '/ph-increaser-2.jpg',
      '/ph-increaser-3.jpg',
      '/ph-increaser-4.jpg',
    ],
    variants: [
      { size: '2 lbs', price: 12.99, sku: 'PH-PLUS-2' },
      { size: '5 lbs', price: 24.99, sku: 'PH-PLUS-5' },
      { size: '25 lbs', price: 89.99, sku: 'PH-PLUS-25' },
    ],
    specs: {
      activeIngredient: 'Sodium Carbonate',
      form: 'Granular',
      pHRange: '7.2 - 7.8',
      usage: '1 tbsp per 500 gallons',
      compatibility: 'All types of spas and hot tubs',
    },
    reviews: [
      { user: 'John D.', rating: 5, comment: 'Works great, easy to use!' },
      { user: 'Sarah M.', rating: 4, comment: 'Good product, but packaging could be improved.' },
      { user: 'Mike R.', rating: 5, comment: 'Quickly balanced my spa water. Highly recommend!' },
    ],
    relatedProducts: [
      {
        id: '2',
        name: 'PH- Decreaser',
        description: 'Lowers the pH level of your spa water.',
        price: 14.99,
        image: '/ph-decreaser.jpg',
      },
      {
        id: '3',
        name: 'Alkalinity Up',
        description: 'Increases the alkalinity of your spa water.',
        price: 16.99,
        image: '/alkalinity-up.jpg',
      },
      {
        id: '4',
        name: 'Chlorine Tablets',
        description: 'Sanitizes your spa water.',
        price: 29.99,
        image: '/chlorine-tablets.jpg',
      },
      {
        id: '5',
        name: 'Test Strips',
        description: 'Accurately test your spa water chemistry.',
        price: 9.99,
        image: '/test-strips.jpg',
      },
    ],
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      console.log(`Added to cart: ${product.name} - ${selectedVariant.size}, Quantity: ${quantity}`)
      // Implement your add to cart logic here
    } else {
      alert('Please select a size')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${i < Math.round(product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">{product.reviews.length} reviews</span>
          </div>
          <p className="mt-4 text-lg text-gray-700">{product.description}</p>
          <div className="mt-6">
            <Select
              onValueChange={(value) =>
                setSelectedVariant(product.variants.find((v) => v.sku === value) || null)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem key={variant.sku} value={variant.sku}>
                    {variant.size} - ${variant.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20"
            />
            <Button className="flex-grow" onClick={handleAddToCart}>
              <ShoppingCartIcon className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center text-green-600">
              <TruckIcon className="h-5 w-5 mr-2" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center text-blue-600">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <p>{product.longDescription}</p>
          </TabsContent>
          <TabsContent value="specs" className="mt-4">
            <ul className="space-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <li key={key} className="flex">
                  <span className="font-semibold w-1/3">{key}:</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {product.reviews.map((review, i) => (
                <div key={i} className="border-b pb-4">
                  <div className="flex items-center">
                    <span className="font-bold">{review.user}</span>
                    <div className="ml-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`inline h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-2">Related Products</h2>
        <p className="text-gray-600 mb-6">
          Complete your water care routine with these recommended products
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.relatedProducts.map((relatedProduct) => (
            <></>
            // <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div>

      <div className="mt-16 bg-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
        <p className="mb-4">
          Our water care experts are here to assist you in choosing the right products for your spa
          or hot tub.
        </p>
        <Button>
          <Link href="/contact" className="flex items-center">
            Contact an Expert
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">How often should I use this product?</h3>
            <p className="text-gray-600">
              We recommend testing your water 2-3 times a week and adjusting as needed. Always
              follow the product instructions for best results.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Is this product safe for all types of spas?</h3>
            <p className="text-gray-600">
              Yes, our PH+ Increaser is compatible with all types of spas and hot tubs. However,
              always check your spa manufacturer&apos;s guidelines.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">How long does it take to see results?</h3>
            <p className="text-gray-600">
              You should see a change in your water&apos;s pH level within 15-30 minutes after
              application. Always retest before further adjustment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
