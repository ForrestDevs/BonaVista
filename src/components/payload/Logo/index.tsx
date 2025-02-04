import Image from 'next/image'
import React from 'react'
import { cn } from '@lib/utils/cn'

import logo from '@/public/logo-dark.png'

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={logo}
      alt="BonaVista Logo"
      width={200}
      height={160}
      className={cn('object-contain aspect-auto w-auto h-auto', className)}
    />
  )
}
