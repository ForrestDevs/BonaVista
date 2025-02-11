import React from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from './Auth'
import { NuqsProvider } from './Nuqs'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LivePreviewListener } from '@/components/payload/LivePreviewListener'
import { draftMode } from 'next/headers'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  const { isEnabled: draft } = await draftMode()

  return (
    <AuthProvider>
      <NuqsProvider>
        {children}
        <Toaster />
        <SpeedInsights />
        {draft && <LivePreviewListener />}
      </NuqsProvider>
    </AuthProvider>
  )
}
