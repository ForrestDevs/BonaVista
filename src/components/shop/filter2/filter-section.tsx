import { ChevronDown } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className="border-b py-6"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between text-sm">
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200 [&[data-state=open]>svg]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-6">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
