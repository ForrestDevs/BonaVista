import React, { useMemo } from 'react'
import { Address } from '@payload-types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import compareAddresses from '@lib/utils/compareAddresses'

type AddressSelectProps = {
  addresses: Address[]
  addressInput: Address | null
  onSelect: (address: Address | undefined, email?: string) => void
}

const AddressSelect = ({ addresses, addressInput, onSelect }: AddressSelectProps) => {
  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)
    if (savedAddress) {
      onSelect(savedAddress)
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, addressInput))
  }, [addresses, addressInput])

  const options = addresses.map((address) => ({
    value: address.id,
    label: `${address.first_name} ${address.last_name}, ${address.address_1}, ${address.city}`,
  }))

  return (
    <Select value={selectedAddress?.id} onValueChange={handleSelect}>
      <SelectTrigger className="w-full" data-testid="shipping-address-select">
        <SelectValue placeholder="Choose an address" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default AddressSelect
