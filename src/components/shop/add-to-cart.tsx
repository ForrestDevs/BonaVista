'use client'

import type { Product } from '@payload-types'
import clsx from 'clsx'
import { PlusIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { addToCart } from '@lib/data/cart'
import Spinner from '@components/ui/spinner'

type ProductVariant = Product['variants']['variantProducts'][number]
type ProductVariantOptions = Product['variants']['options'][number]

type BaseProps = {
  product: Product
}

type PropsWithVariants = {
  info?: never
  variants: ProductVariant[]
}

type PropsWithInfo = {
  info: Product['variants']
  variants?: never
}

type Props = BaseProps & (PropsWithInfo | PropsWithVariants)

export function AddToCart({ product, variants }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedVariantId = searchParams.get('variant')
  const [isAdding, setIsAdding] = useState(false)

  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white'
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60'

  const productUrl = useMemo(() => {
    const base = `/product/${product.slug}`

    if (selectedVariantId) {
      const variant = variants.find((variant) => variant.id === selectedVariantId)
      const variantOptions = product.variants.options.map(
        (option) => `${option.slug}=${option.values}`,
      )
      return `${base}?variant=${selectedVariantId}&${variantOptions.join('&')}`
    } else {
      return base
    }
  }, [product, selectedVariantId, variants])

  if (!true) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)} type="submit">
        Out Of Stock
      </button>
    )
  }

  const handleAddToCart = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log('add to cart')
    setIsAdding(true)

    await addToCart({
      id: selectedVariantId ?? product.id,
      product,
      quantity: 1,
      url: productUrl,
      variant: selectedVariantId ?? undefined,
    })

    setIsAdding(false)
    router.refresh()
  }

  return (
    <button
      disabled={isAdding}
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
      })}
      onClick={handleAddToCart}
      type="submit"
    >
      {isAdding ? (
        <Spinner />
      ) : (
        <>
          <div className="absolute left-0 ml-4">
            <PlusIcon className="h-5" />
          </div>
          Add To Cart
        </>
      )}
    </button>
  )
}
