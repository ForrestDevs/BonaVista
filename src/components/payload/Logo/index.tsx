import Image from 'next/image'
import React from 'react'

export const Logo = () => {
  return (
    <Image
      src="/logo-dark.png"
      alt="BonaVista Logo"
      width={300}
      height={200}
      className="w-auto h-auto max-w-full"
      style={{ objectFit: 'contain' }}
    />
  )
}
