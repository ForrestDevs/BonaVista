'use client'

import React, { useEffect, useState } from 'react'
import { useRowLabel } from '@payloadcms/ui'
import type { InfoType } from '../types'

type RowData = {
  id: string
  info: InfoType
  options: string[]
  stock: number
  stripeProductID: string
}

export default function VariantLabel() {
  const { data, rowNumber } = useRowLabel<RowData>()
  const [label, setLabel] = useState(`Variant ${rowNumber}`)

  useEffect(() => {
    if (data?.info) {
      const info = data.info

      const labels: string[] = []

      info.options.forEach((option) => {
        labels.push(option.label)
      })

      setLabel(labels.join(' '))
    } else {
      setLabel(`Variant ${rowNumber}`)
    }
  }, [data, rowNumber])

  return (
    <div>
      <span>{label}</span>
    </div>
  )
}
