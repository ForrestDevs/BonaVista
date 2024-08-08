import React from 'react'
import { cn } from '@/lib/utils/cn'
import type { ComponentProps } from 'react'

export function Fieldset({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cn(className, 'space-y-2')} />
}
