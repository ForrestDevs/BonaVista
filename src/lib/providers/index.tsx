import React from 'react'
import ThemeProvider from '@/lib/providers/Theme'
import { Toaster } from 'sonner'
import { AuthProvider } from './Auth'
import { NuqsProvider } from './Nuqs'
import { AdminBar } from '@/components/payload/AdminBar'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LivePreviewListener } from '@/components/payload/LivePreviewListener'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NuqsProvider>
          {/* <AdminBar /> */}
          {children}
          <Toaster />
          <SpeedInsights />
          <LivePreviewListener />
        </NuqsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
