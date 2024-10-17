'use client'
import { useRowLabel } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

import type { Option } from '../types'

export default function OptionLabel() {
  const { data, rowNumber } = useRowLabel<Option>()
  const [label, setLabel] = useState(`Option ${rowNumber}`)

  useEffect(() => {
    if (data?.label) {
      setLabel(data.label)
    } else {
      setLabel(`Option ${rowNumber}`)
    }
  }, [data, rowNumber])

  return (
    <div>
      <span>{label}</span>
    </div>
  )
}
