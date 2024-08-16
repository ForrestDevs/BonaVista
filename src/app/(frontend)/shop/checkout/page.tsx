import React, { Fragment } from 'react'
import type { Metadata } from 'next'
import type { Settings, User } from '@payload-types'

import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { getMeUser } from '@/lib/utils/getMeUser'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LowImpactHero } from '@/components/layout/heros/low-impact'
import { CheckoutPage } from './checkout-page'
import { mergeOpenGraph } from '@/lib/utils/merge-open-graph'
import getPayload from '@/lib/utils/getPayload'
import { AuthArgs } from 'node_modules/payload/dist/auth/operations/auth'
import { headers as getHeaders } from 'next/headers'

export default async function Checkout() {
    const headers = getHeaders()

  //   const { user } = await getMeUser({
  //     nullUserRedirect: `/login?error=${encodeURIComponent(
  //       'You must be logged in to checkout.',
  //     )}&redirect=${encodeURIComponent('/checkout')}`,
  //   })

  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await req.json()
    console.log(JSON.stringify(data, null, 2))
  } catch (err) {
    console.log(err)
  }
  const payload = await getPayload()

  const { user } = await payload.auth({
    headers,
  })

  console.log(user)
  
  let settings: Settings | null = null

  try {
    settings = await getCachedGlobal<'settings'>('settings')
  } catch (error) {
    // no need to redirect to 404 here, just simply render the page with fallback data where necessary
    console.error(error) // eslint-disable-line no-console
  }

  return (
    <div>
      {!process.env.STRIPE_PUBLISHABLE_KEY && (
        <Alert variant={'destructive'}>
          <AlertTitle>Stripe API Keys not set</AlertTitle>
          <AlertDescription>
            <Fragment>
              To enable checkout, you must{' '}
              <a
                href="https://dashboard.stripe.com/test/apikeys"
                rel="noopener noreferrer"
                target="_blank"
              >
                obtain your Stripe API Keys
              </a>{' '}
              then set them as environment variables. See the{' '}
              <a
                href="https://github.com/payloadcms/payload/blob/main/templates/ecommerce/README.md#stripe"
                rel="noopener noreferrer"
                target="_blank"
              >
                README
              </a>
              for more details.
            </Fragment>
          </AlertDescription>
        </Alert>
      )}
      {/* <LowImpactHero
        media={null}
        richText={{
          root: {
            type: 'root',
            children: [
              {
                type: 'h1',
                version: 1,
                children: [
                  {
                    text: 'Checkout',
                  },
                ],
              },
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    text: `This is a self-hosted, secure checkout using Stripe's Payment Element component. To create a mock purchase, use a `,
                  },
                  {
                    type: 'link',
                    children: [
                      {
                        text: 'test credit card',
                      },
                    ],
                    url: 'https://stripe.com/docs/testing#cards',
                  },
                  {
                    text: ' like ',
                  },
                  {
                    bold: true,
                    text: '4242 4242 4242 4242',
                  },
                  {
                    text: ' with any future date and CVC. An order will be generated in Stripe and will appear in your account. In production, this checkout form will require a real card with sufficient funds.',
                  },
                ],
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        }}
        type="lowImpact"
      /> */}
      <CheckoutPage settings={settings!} user={user as User} />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
  title: 'Account',
}
