import React, { Fragment } from 'react'
import { Container } from '../ui/craft'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function MissingStripeKeyAlert() {
  return (
    <Fragment>
      {!process.env.STRIPE_PUBLISHABLE_KEY && (
        <Container>
          <Alert>
            <AlertTriangle />
            <AlertTitle>Stripe API Keys Required</AlertTitle>
            <AlertDescription>
              <p>To enable checkout, you must</p>
              <Link href="https://dashboard.stripe.com/test/apikeys" target="_blank">
                obtain your Stripe API Keys
              </Link>
              <p>then set them as environment variables. See the</p>
              <Link
                href="https://github.com/payloadcms/payload/blob/main/templates/ecommerce/README.md#stripe"
                target="_blank"
              >
                README
              </Link>
              <p>for more details.</p>
            </AlertDescription>
          </Alert>
        </Container>
      )}
    </Fragment>
  )
}
