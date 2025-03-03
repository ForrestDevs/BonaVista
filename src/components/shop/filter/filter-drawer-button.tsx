'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Filter, Loader2 } from 'lucide-react'
import { FilterConfig } from './types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ProductFilters } from './product-filters'
import { useTransition } from 'react'

export function FilterDrawerButton({
  config,
  activeFilterCount = 0,
}: {
  config: FilterConfig
  activeFilterCount: number
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1 flex items-center justify-between"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Filter className="h-3.5 w-3.5 mr-1" />
          )}
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full h-5 min-w-5 px-1 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col overflow-hidden">
        <SheetHeader className="mb-2">
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>
            Refine your search with the following filter options
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="pb-8 pt-2">
            <ProductFilters 
              config={config} 
              useDrawerLayout={true} 
              startTransition={startTransition}
            />
          </div>
        </ScrollArea>

        <SheetFooter className="pt-4 border-t border-border mt-auto">
          <SheetClose asChild>
            <Button className="w-full" disabled={isPending}>
              View Results
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
} 