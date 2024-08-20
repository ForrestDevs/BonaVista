'use client'

import {
  Select,
  CopyToClipboard,
  TextField,
  useField,
  useDocumentInfo,
  useForm,
} from '@payloadcms/ui'
import { useState, useEffect, use } from 'react'

type OptionsType = {
  label: string
  value: string
}

export function PriceSelect(props: typeof TextField) {
  const { name } = props
  const [options, setOptions] = useState<OptionsType[]>([])
  
  
  const { getDataByPath } = useForm()

  const hasVariant = getDataByPath('hasVariants')

  const path = hasVariant ? 'variants' + name : 'baseVariant.' + name

  const { value, setValue } = useField({ path })

  const stripeProductID = getDataByPath('stripeProductID')



  useEffect(() => {
    const fetchPrices = async () => {
      if (stripeProductID) {
        try {
          const pricesFetch = await fetch(`/api/stripe/prices?product=${stripeProductID}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          const res = await pricesFetch.json()

          if (res?.data) {
            const fetchedPrices = res.data.map((item: any) => ({
              label: `${item.nickname || item.id} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency }).format(item.unit_amount / 100)}`,
              value: item.id,
            }))


            setOptions([{ label: 'Select a price', value: '' }, ...fetchedPrices])
            console.log('options', fetchedPrices)
          }
        } catch (error) {
          console.error('Error fetching prices:', error)
        }
      }
    }

    console.log('stripeProductID', stripeProductID)
    console.log('name', name)
    console.log('value', value)
    console.log('hasVariant', hasVariant)

    fetchPrices()
  }, [stripeProductID, name, value, hasVariant])

  const href = `https://dashboard.stripe.com/${
    process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
  }prices/${value}`

  return (
    <div>
      <p style={{ marginBottom: '0' }}>Price</p>
      <p
        style={{
          color: 'var(--theme-elevation-400)',
          marginBottom: '0.75rem',
        }}
      >
        {`Select the related Stripe price or `}
        <a
          href={`https://dashboard.stripe.com/${
            process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
          }prices/create`}
          rel="noopener noreferrer"
          style={{ color: 'var(--theme-text)' }}
          target="_blank"
        >
          create a new one
        </a>
        .
      </p>

      <Select
        {...props}
        options={options}
        value={options.find((option) => option.value === value)}
        onChange={(selectedOption) => {
          setValue((selectedOption as OptionsType).value)
        }}
      />

      {Boolean(value) && (
        <div className="pt-4">
          <div>
            <span
              className="label"
              style={{
                color: '#9A9A9A',
              }}
            >
              {`Manage "${
                options.find((option) => option.value === value)?.label || 'Unknown'
              }" in Stripe`}
            </span>
            <CopyToClipboard value={href} />
          </div>
          <div
            style={{
              fontWeight: '600',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <a
              href={`https://dashboard.stripe.com/${
                process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
              }products/${value}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              {href}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
