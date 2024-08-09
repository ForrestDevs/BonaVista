// import { EllipseMiniSolid } from '@medusajs/icons'
import { Ellipsis } from 'lucide-react'
// import { Label, RadioGroup, Text, clx } from '@medusajs/ui'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils/cn'
import { ChangeEvent } from 'react'

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  'data-testid'?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  'data-testid': dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <h1>{title}</h1>
      {/* <Text className="txt-compact-small-plus text-ui-fg-muted">{title}</Text> */}
      <RadioGroup data-testid={dataTestId}>
        {items?.map((i) => (
          <div
            key={i.value}
            className={cn('flex gap-x-2 items-center', {
              'ml-[-1.75rem]': i.value === value,
            })}
          >
            {i.value === value && <Ellipsis />}
            <RadioGroupItem
              checked={i.value === value}
              onClick={(e) => handleChange(e as unknown as ChangeEvent<HTMLButtonElement>, i.value)}
              className="hidden peer"
              id={i.value}
              value={i.value}
            />
            <Label
              //   placeholder={i.label}
              htmlFor={i.value}
              className={cn(
                '!txt-compact-small !transform-none text-ui-fg-subtle hover:cursor-pointer',
                {
                  'text-ui-fg-base': i.value === value,
                },
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
