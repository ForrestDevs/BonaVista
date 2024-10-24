import Image from 'next/image'
import React from 'react'
import { cn } from '@lib/utils/cn'

import logo from '@/public/logo-dark.png'

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={logo}
      alt="BonaVista Logo"
      // width={300}
      // height={200}
      className={cn('w-auto h-auto max-w-full', className)}
      style={{ objectFit: 'contain' }}
    />
  )
}
