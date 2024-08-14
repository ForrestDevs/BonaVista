"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { InfoIcon, ShoppingCartIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ProductVariant = {
  size: string
  price: number
  sku: string
}

type Product = {
  id: string
  name: string
  description: string
  image: string
  variants: ProductVariant[]
}

export function ProductCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null,
  )

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to product detail page
    if (selectedVariant) {
      console.log(`Added to cart: ${product.name} - ${selectedVariant.size}`)
      // Here you would call your actual add to cart function
    }
  }

  return (
    <Link href={`/store/product/${product.id}`} passHref>
      <Card className="cursor-pointer group transition-all duration-300 hover:shadow-lg">
        <CardHeader className="p-0 relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <InfoIcon className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300">
            {product.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
          {selectedVariant && (
            <p className="text-lg font-bold mt-2">${selectedVariant.price.toFixed(2)}</p>
          )}
        </CardContent>
        <CardFooter className="p-4">
          {product.variants.length > 1 ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-full" onClick={(e) => e.preventDefault()}>
                  <ShoppingCartIcon className="mr-2 h-4 w-4" />
                  {selectedVariant ? `Add ${selectedVariant.size} to Cart` : 'Select Size'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="grid gap-4">
                  <h4 className="font-medium leading-none">Select Size</h4>
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.sku}
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedVariant(variant)
                        handleAddToCart(e)
                      }}
                    >
                      {variant.size} - ${variant.price.toFixed(2)}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button className="w-full" onClick={handleAddToCart}>
              <ShoppingCartIcon className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

export function ShopWaterCare() {
  const products: Product[] = [
    {
      id: 'prod_001',
      name: 'Chlorine Tablets',
      description: 'Stabilized chlorine tablets for effective sanitization of hot tubs and pools.',
      image: 'chlorine_tablets.png',
      variants: [
        { size: '2 lbs', price: 19.99, sku: 'CHLORINE_2LBS' },
        { size: '5 lbs', price: 44.99, sku: 'CHLORINE_5LBS' },
        { size: '10 lbs', price: 79.99, sku: 'CHLORINE_10LBS' },
      ],
    },
    {
      id: 'prod_002',
      name: 'pH Increaser',
      description: 'Raises the pH level in your pool, hot tub, or spa to maintain water balance.',
      image: 'ph_increaser.png',
      variants: [
        { size: '1 lb', price: 9.99, sku: 'PH_INC_1LB' },
        { size: '4 lbs', price: 34.99, sku: 'PH_INC_4LBS' },
      ],
    },
    {
      id: 'prod_003',
      name: 'pH Reducer',
      description:
        'Lowers the pH level in your pool, hot tub, or spa to prevent scaling and cloudiness.',
      image: 'ph_reducer.png',
      variants: [
        { size: '1.5 lbs', price: 12.99, sku: 'PH_RED_1_5LBS' },
        { size: '3 lbs', price: 21.99, sku: 'PH_RED_3LBS' },
      ],
    },
    {
      id: 'prod_004',
      name: 'Alkalinity Increaser',
      description: 'Boosts total alkalinity to prevent pH fluctuations in your water.',
      image: 'alkalinity_increaser.png',
      variants: [
        { size: '3 lbs', price: 15.99, sku: 'ALK_INC_3LBS' },
        { size: '6 lbs', price: 29.99, sku: 'ALK_INC_6LBS' },
      ],
    },
    {
      id: 'prod_005',
      name: 'Calcium Hardness Increaser',
      description:
        'Increases calcium levels in your pool or spa to protect equipment and surfaces.',
      image: 'calcium_hardness_increaser.png',
      variants: [
        { size: '4 lbs', price: 24.99, sku: 'CAL_INC_4LBS' },
        { size: '8 lbs', price: 44.99, sku: 'CAL_INC_8LBS' },
      ],
    },
    {
      id: 'prod_006',
      name: 'Spa Shock',
      description: 'Non-chlorine shock treatment for quick oxidation of contaminants in spa water.',
      image: 'spa_shock.png',
      variants: [
        { size: '2 lbs', price: 19.99, sku: 'SPA_SHOCK_2LBS' },
        { size: '5 lbs', price: 39.99, sku: 'SPA_SHOCK_5LBS' },
      ],
    },
    {
      id: 'prod_007',
      name: 'Pool Algaecide',
      description: 'Concentrated formula to prevent and treat algae growth in pools and swim spas.',
      image: 'pool_algaecide.png',
      variants: [
        { size: '1 quart', price: 22.99, sku: 'ALG_QUART' },
        { size: '1 gallon', price: 74.99, sku: 'ALG_GALLON' },
      ],
    },
    {
      id: 'prod_008',
      name: 'Stain & Scale Preventer',
      description: 'Prevents stains and scale buildup on pool and spa surfaces.',
      image: 'stain_scale_preventer.png',
      variants: [
        { size: '1 quart', price: 19.99, sku: 'STAIN_SCALE_1QT' },
        { size: '1 gallon', price: 69.99, sku: 'STAIN_SCALE_1GAL' },
      ],
    },
    {
      id: 'prod_009',
      name: 'Water Clarifier',
      description: 'Clears cloudy water by helping filter out small particles in your pool or spa.',
      image: 'water_clarifier.png',
      variants: [
        { size: '1 quart', price: 15.99, sku: 'CLARIFIER_1QT' },
        { size: '1 gallon', price: 59.99, sku: 'CLARIFIER_1GAL' },
      ],
    },
    {
      id: 'prod_010',
      name: 'Bromine Tablets',
      description: 'Effective bromine tablets for sanitizing hot tubs and swim spas.',
      image: 'bromine_tablets.png',
      variants: [
        { size: '2 lbs', price: 24.99, sku: 'BROMINE_2LBS' },
        { size: '5 lbs', price: 59.99, sku: 'BROMINE_5LBS' },
      ],
    },
    {
      id: 'prod_011',
      name: 'Spa Fragrance',
      description: 'Enhance your spa experience with soothing scents that are safe for water.',
      image: 'spa_fragrance.png',
      variants: [
        { size: '8 oz', price: 14.99, sku: 'FRAGRANCE_8OZ' },
        { size: '16 oz', price: 24.99, sku: 'FRAGRANCE_16OZ' },
      ],
    },
    {
      id: 'prod_012',
      name: 'Filter Cleaner',
      description: 'Removes oils and debris from filters to improve water circulation and clarity.',
      image: 'filter_cleaner.png',
      variants: [
        { size: '16 oz', price: 12.99, sku: 'FILTER_CLEAN_16OZ' },
        { size: '32 oz', price: 21.99, sku: 'FILTER_CLEAN_32OZ' },
      ],
    },
    {
      id: 'prod_013',
      name: 'Defoamer',
      description: 'Eliminates unwanted foam in hot tubs, pools, and swim spas.',
      image: 'defoamer.png',
      variants: [
        { size: '1 pint', price: 9.99, sku: 'DEFOAMER_1PT' },
        { size: '1 quart', price: 16.99, sku: 'DEFOAMER_1QT' },
      ],
    },
    {
      id: 'prod_014',
      name: 'Metal Control',
      description: 'Prevents metal staining and discoloration in pool and spa water.',
      image: 'metal_control.png',
      variants: [
        { size: '1 quart', price: 17.99, sku: 'METAL_CTRL_1QT' },
        { size: '1 gallon', price: 64.99, sku: 'METAL_CTRL_1GAL' },
      ],
    },
    {
      id: 'prod_015',
      name: 'Foam-Free',
      description: 'Quickly removes and prevents foam in hot tubs and swim spas.',
      image: 'foam_free.png',
      variants: [
        { size: '8 oz', price: 8.99, sku: 'FOAM_FREE_8OZ' },
        { size: '16 oz', price: 14.99, sku: 'FOAM_FREE_16OZ' },
      ],
    },
    {
      id: 'prod_016',
      name: 'Enzyme Cleaner',
      description: 'Breaks down oils and organic contaminants for cleaner, fresher water.',
      image: 'enzyme_cleaner.png',
      variants: [
        { size: '1 pint', price: 11.99, sku: 'ENZYME_CLEAN_1PT' },
        { size: '1 quart', price: 19.99, sku: 'ENZYME_CLEAN_1QT' },
      ],
    },
    {
      id: 'prod_017',
      name: 'Chlorine Granules',
      description: 'Fast-dissolving chlorine granules for immediate sanitization of pool water.',
      image: 'chlorine_granules.png',
      variants: [
        { size: '2 lbs', price: 22.99, sku: 'CHLORINE_GRAN_2LBS' },
        { size: '5 lbs', price: 49.99, sku: 'CHLORINE_GRAN_5LBS' },
      ],
    },
    {
      id: 'prod_018',
      name: 'Non-Chlorine Shock',
      description: 'Powerful oxidizer to eliminate contaminants without chlorine.',
      image: 'non_chlorine_shock.png',
      variants: [
        { size: '2 lbs', price: 18.99, sku: 'NON_CHL_SHOCK_2LBS' },
        { size: '5 lbs', price: 37.99, sku: 'NON_CHL_SHOCK_5LBS' },
      ],
    },
    {
      id: 'prod_019',
      name: 'Spa Test Strips',
      description: 'Quick and easy test strips for monitoring spa water chemistry.',
      image: 'spa_test_strips.png',
      variants: [
        { size: '50 strips', price: 12.99, sku: 'TEST_STRIPS_50' },
        { size: '100 strips', price: 22.99, sku: 'TEST_STRIPS_100' },
      ],
    },
    {
      id: 'prod_020',
      name: 'Total Alkalinity Test Kit',
      description: 'Simple test kit to measure and maintain total alkalinity levels in water.',
      image: 'alkalinity_test_kit.png',
      variants: [{ size: '1 kit', price: 14.99, sku: 'ALK_TEST_KIT' }],
    },
  ]

  return (
    // ... (previous layout code)
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    // ... (rest of the layout)
  )
}
