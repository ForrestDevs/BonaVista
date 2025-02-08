import React from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from './Auth'
import { NuqsProvider } from './Nuqs'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LivePreviewListener } from '@/components/payload/LivePreviewListener'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  return (
    <AuthProvider>
      <NuqsProvider>
        {children}
        <Toaster />
        <SpeedInsights />
        <LivePreviewListener />
      </NuqsProvider>
    </AuthProvider>
  )
}
