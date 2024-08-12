'use client'

import React, { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { httpBatchLink } from '@trpc/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({}))
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `/api/trpc`,
        }),
      ],
    }),
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
