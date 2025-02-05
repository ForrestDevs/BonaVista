import { X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface MobileFilterDialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function MobileFilterDialog({ open, onClose, children }: MobileFilterDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            <button
              type="button"
              className="-mr-2 flex h-10 w-10 items-center justify-center"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </SheetHeader>
        <div className="mt-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
