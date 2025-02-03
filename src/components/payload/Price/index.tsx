import React from 'react'

type BaseProps = {
  className?: string
  currencyCode: string
  currencyCodeClassName?: string
}

type PriceFixed = {
  amount: number
  highestAmount?: never
  lowestAmount?: never
}

type PriceRange = {
  amount?: never
  highestAmount: number
  lowestAmount: number
}

type Props = BaseProps & (PriceFixed | PriceRange)

const Price = ({
  amount,
  className,
  currencyCode = 'CAD',
  highestAmount,
  lowestAmount,
}: Props & React.ComponentProps<'p'>) => {
  if (amount) {
    return (
      <p className={className} suppressHydrationWarning>
        {`${new Intl.NumberFormat(undefined, {
          currency: currencyCode,
          currencyDisplay: 'narrowSymbol',
          style: 'currency',
        }).format(amount)}`}
      </p>
    )
  }

  if (highestAmount && highestAmount !== lowestAmount) {
    return (
      <p className={className} suppressHydrationWarning>
        {`${new Intl.NumberFormat(undefined, {
          currency: currencyCode,
          currencyDisplay: 'narrowSymbol',
          style: 'currency',
        }).format(lowestAmount)} - ${new Intl.NumberFormat(undefined, {
          currency: currencyCode,
          currencyDisplay: 'narrowSymbol',
          style: 'currency',
        }).format(highestAmount)}`}
      </p>
    )
  }

  return (
    <p className={className} suppressHydrationWarning>
      {lowestAmount !== undefined
        ? `${new Intl.NumberFormat(undefined, {
            currency: currencyCode,
            currencyDisplay: 'narrowSymbol',
            style: 'currency',
          }).format(lowestAmount)}`
        : 'Price not available'}
    </p>
  )
}

export default Price
