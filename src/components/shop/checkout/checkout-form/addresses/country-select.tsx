import { forwardRef, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'

type CountrySelectProps = {
  name: string
  autoComplete: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  'data-testid'?: string
  placeholder?: string
}

const CountrySelect = forwardRef<HTMLButtonElement, CountrySelectProps>(
  (
    {
      name,
      autoComplete,
      value,
      onChange,
      required,
      'data-testid': dataTestId,
      placeholder = 'Country',
      ...props
    },
    ref,
  ) => {
    const countryOptions = useMemo(
      () => [
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
        { value: 'GB', label: 'United Kingdom' },
        // Add more countries as needed
      ],
      [],
    )

    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger ref={ref} name={name} data-testid={dataTestId}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {countryOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  },
)

CountrySelect.displayName = 'CountrySelect'

export default CountrySelect
