'use client'

import { MinusIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProduct } from '../context/product-context'

export function QuantitySelector({ min = 1, max = 99 }: { min?: number; max?: number }) {
  const { quantity, setQuantity } = useProduct()

  const handleIncrement = () => {
    if (quantity < max) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > min) {
      setQuantity(quantity - 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value)) {
      const clampedValue = Math.max(min, Math.min(max, value))
      setQuantity(clampedValue)
    }
  }

  const handleBlur = () => {
    if (isNaN(quantity) || quantity < min) {
      setQuantity(min)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="h-9 w-9"
      >
        <MinusIcon className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        className="h-9 w-14 px-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="h-9 w-9"
      >
        <PlusIcon className="h-3 w-3" />
      </Button>
    </div>
  )
} 