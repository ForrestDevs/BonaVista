'use client'

import { useHeaderTheme } from '@/lib/providers/HeaderTheme'
import React, { useEffect } from 'react'

export const Client: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])
  return <React.Fragment />
}

