'use client'

import { Select, CopyToClipboard, TextField, useField } from '@payloadcms/ui'
import { useState, useEffect, use } from 'react'

type OptionsType = {
  label: string
  value: string
}

export function ProductSelect(props: typeof TextField) {
  const { name } = props
  const [options, setOptions] = useState<OptionsType[]>([])
  const { value, setValue } = useField({ path: name })

  useEffect(() => {
    const getStripeProducts = async () => {
      const productsFetch = await fetch('/api/stripe/products', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const res = await productsFetch.json()

      console.log('res', res)

      if (res?.data) {
        const fetchedProducts = res.data.reduce(
          (acc: any, item: any) => {
            acc.push({
              label: item.name || item.id,
              value: item.id,
            })
            return acc
          },
          [
            {
              label: 'Select a product',
              value: '',
            },
          ],
        )
        setOptions(fetchedProducts)
      }
    }

    getStripeProducts()
  }, [])

  const href = `https://dashboard.stripe.com/${
    process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
  }products/${value}`

  return (
    <div>
      <p style={{ marginBottom: '0' }}>Product</p>
      <p
        style={{
          color: 'var(--theme-elevation-400)',
          marginBottom: '0.75rem',
        }}
      >
        {`Select the related Stripe product or `}
        <a
          href={`https://dashboard.stripe.com/${
            process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
          }products/create`}
          rel="noopener noreferrer"
          style={{ color: 'var(--theme-text' }}
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
