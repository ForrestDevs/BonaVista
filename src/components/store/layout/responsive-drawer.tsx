'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, type ReactNode } from 'react'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { useMediaQuery } from '@/components/ui/hooks/useMediaQuery'

export function ResponsiveDrawer({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const timerId = useRef<NodeJS.Timeout | null>(null)

  const resetDrawer = (e: boolean) => {
    if (!e) {
      if (timerId.current) {
        clearTimeout(timerId.current)
      }
      timerId.current = setTimeout(() => {
        router.back()
      }, 100)
    }
  }

  return (
    <Drawer open={open} direction={isDesktop ? 'right' : 'bottom'} onOpenChange={resetDrawer}>
      <DrawerContent
        onPointerDownOutside={() => {
          setOpen(false)
        }}
        onEscapeKeyDown={() => {
          setOpen(false)
        }}
      >
        {children}
      </DrawerContent>
    </Drawer>
  )
}
