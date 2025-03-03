type Money = { amount: number; currency: string }

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export const assertInteger = (value: number) => {
  invariant(Number.isInteger(value), 'Value must be an integer')
}

const getDecimalsForStripe = (currency: string) => {
  invariant(currency.length === 3, 'currency needs to be a 3-letter code')

  const stripeDecimals = stripeCurrencies[currency.toUpperCase()]
  const decimals = stripeDecimals ?? 2
  return decimals
}

export const getDecimalFromStripeAmount = ({ amount: minor, currency }: Money) => {
  assertInteger(minor)
  const decimals = getDecimalsForStripe(currency)
  const multiplier = 10 ** decimals
  return Number.parseFloat((minor / multiplier).toFixed(decimals))
}

export const formatMoney = ({
  amount,
  currency,
  locale = 'en-US',
}: Money & { locale?: string }) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatStripeMoney = ({
  amount: minor,
  currency,
  locale = 'en-US',
}: Money & { locale?: string }) => {
  if (!minor) {
    return '0.00'
  }
  const amount = getDecimalFromStripeAmount({ amount: minor, currency })
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatCurrency = ({
  amount,
  currency,
  locale = 'en-US',
}: Money & { locale?: string }) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

// https://docs.stripe.com/development-resources/currency-codes
const stripeCurrencies: Record<string, number> = {
  BIF: 0,
  CLP: 0,
  DJF: 0,
  GNF: 0,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  MGA: 0,
  PYG: 0,
  RWF: 0,
  UGX: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
  BHD: 3,
  JOD: 3,
  KWD: 3,
  OMR: 3,
  TND: 3,
}
