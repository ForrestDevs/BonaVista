import { type Metadata } from 'next/types'
import React, { Fragment } from 'react'
import { notFound } from 'next/navigation'
import type { Page, Settings, User } from '@/payload-types'
import { generateMeta } from '@/lib/utils/generateMeta'
import getPayload from '@/lib/utils/getPayload'
import { PAGE_SLUG } from '@/payload/collections/constants'
import { Container } from '@/components/ui/craft'
import MissingStripeKeyAlert from '@/components/errors/missing-stripe-key'
import { CheckoutCard } from '@/components/shop/checkout/CheckoutCard'
import { Hero } from '@/components/layout/heros/render'
import { Blocks } from '@/components/layout/blocks/render'
import { CartTemplate } from '@/components/shop/cart/layout/cart-template'
import { headers as getHeaders } from 'next/headers'

export default async function Cart() {
  const payload = await getPayload()

  let page: Page | null = null

  try {
    const pages = await payload.find({
      collection: PAGE_SLUG,
      where: {
        slug: {
          equals: 'cart',
        },
      },
    })

    page = pages.docs[0]
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  if (!page) {
    return notFound()
  }

  let settings: Settings | null = null

  try {
    settings = await payload.findGlobal({
      slug: 'settings',
    })
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }
  const headers = getHeaders()
  const { user } = await payload.auth({ headers })

  return (
    <Fragment>
      <MissingStripeKeyAlert />
      <Hero {...page?.hero} />
      <CartTemplate page={page} settings={settings!} user={user as User} />
      <Blocks blocks={page?.layout} />
    </Fragment>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  let page: Page | null = null
  const payload = await getPayload()

  try {
    const pages = await payload.find({
      collection: PAGE_SLUG,
      where: {
        slug: {
          equals: 'cart',
        },
      },
    })

    page = pages.docs[0]
  } catch (error) {
    // don't throw an error if the fetch fails
    // this is so that we can render a static cart page for the demo
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // in production you may want to redirect to a 404  page or at least log the error somewhere
  }

  return generateMeta({ doc: page, collectionSlug: PAGE_SLUG })
}