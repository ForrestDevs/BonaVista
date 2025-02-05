import { useState, useEffect } from 'react'
import { useDebouncedValue } from '@/lib/hooks/useDebounce'

interface PriceRangeProps {
  value: { min: number; max: number }
  onChange: (value: { min: number; max: number }) => void
}

export function PriceRange({ value, onChange }: PriceRangeProps) {
  const [localMin, setLocalMin] = useState(value.min.toString())
  const [localMax, setLocalMax] = useState(value.max === Infinity ? '' : value.max.toString())

  const debouncedMin = useDebouncedValue(localMin, 500)
  const debouncedMax = useDebouncedValue(localMax, 500)

  useEffect(() => {
    const min = Number(debouncedMin) || 0
    const max = Number(debouncedMax) || Infinity
    onChange({ min, max })
  }, [debouncedMin, debouncedMax, onChange])

  return (
    <div className="flex gap-2 items-center">
      <input
        type="number"
        value={localMin}
        onChange={(e) => setLocalMin(e.target.value)}
        placeholder="Min"
        className="w-24 px-2 py-1 border rounded"
      />
      <span>to</span>
      <input
        type="number"
        value={localMax}
        onChange={(e) => setLocalMax(e.target.value)}
        placeholder="Max"
        className="w-24 px-2 py-1 border rounded"
      />
    </div>
  )
}
