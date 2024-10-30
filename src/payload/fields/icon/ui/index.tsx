'use client'

import React from 'react'

import {
  Select,
  useFormFields,
  SelectField,
  SelectInput,
  ReactSelectOption,
  useFieldProps,
} from '@payloadcms/ui'

import { useField } from '@payloadcms/ui'

import { icons } from 'lucide-react'

export function generateLucideIconOptions(): ReactSelectOption[] {
  const lucideIconOptions: ReactSelectOption[] = []

  Object.keys(icons).forEach((icon) => {
    lucideIconOptions.push({
      label: icon,
      value: icon,
    })
  })

  return lucideIconOptions
}

interface LucideProps {
  name: string
  color: string
  size: number
}

export const LucideIcon = ({ name, color, size }: LucideProps) => {
  if (!name) return null

  const LucideIcon = icons[name as keyof typeof icons]

  return <LucideIcon color={color} size={size} />
}

export function CustomIconSelect() {
  const { path } = useFieldProps()
  const { value, setValue } = useField({ path })

  return (
    <div>
      {path}
      {value as string}
      <Select
        options={generateLucideIconOptions()}
        onChange={(value) => setValue(value)}
        // @ts-ignore
        // value={value}
      />
      <h3>Preview</h3>
      {/* @ts-ignore */}
      <LucideIcon name={value} color={'black'} size={48} />
    </div>
  )
}
