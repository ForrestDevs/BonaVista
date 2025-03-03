'use client'

import { getTranslation } from '@payloadcms/translations'
import { useRowLabel, useTranslation } from '@payloadcms/ui'
import { CollectionSlug, LabelFunction, StaticLabel } from 'payload'
import { useEffect, useState } from 'react'

const RowLabel = ({
  defaultLabel,
  path,
  relationTo,
}: {
  defaultLabel: LabelFunction | StaticLabel
  path: string
  relationTo?: CollectionSlug
}) => {
  const [label, setLabel] = useState<string | null>(null)

  const { i18n } = useTranslation()

  const { data, rowNumber } = useRowLabel<any>()

  useEffect(() => {
    if (relationTo) {
      const [field, property] = path.split('.')

      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/${relationTo}/${data?.[field]}`)
        .then((res) => res.json())
        .then((res) => {
          setLabel(res[property])
        })
    }
  }, [])
  if (label) return label

  let generated: any = data

  for (const segment of path.split('.')) {
    generated = generated?.[segment]
  }

  if (generated) return generated

  return `${getTranslation(defaultLabel, i18n)} ${String(rowNumber).padStart(2, '0')}`
}

export default RowLabel
