import { Product } from '@/payload-types'
import type { CollectionBeforeChangeHook } from 'payload'
import { stripe } from '@/payload/stripe'

const logs = true

interface BaseVariant {
  priceJSON?: string
  [key: string]: any
}

export const beforeProductChange: CollectionBeforeChangeHook<Product> = async ({
  data,
  req,
  operation,
}) => {
  const { payload } = req

  if (operation === 'create') {
    if (logs) payload.logger.info(`Creating product 'beforeChange' hook`)
    // create a new Stripe product
    if (logs) payload.logger.info(`Creating Stripe product`)
    // try {
    //   const stripeProduct = await stripe.products.create({
    //     name: data.title ?? '',
    //     description: data.description ?? '',
    //   })

    //   // assign the new Stripe product ID to the product
    //   return {
    //     ...data,
    //     stripeProductID: stripeProduct.id,
    //   }
    // } catch (error: unknown) {
    //   payload.logger.error(`Error creating Stripe product: ${error}`)
    // }
    return data
  }

  if (operation === 'update') {
    if (logs) payload.logger.info(`Updating product 'beforeChange' hook`)
    const newDoc: Partial<Product> = {
      ...data,
      skipSync: false, // Set back to 'false' so that all changes continue to sync to Stripe
    }

    if (data.skipSync) {
      if (logs) payload.logger.info(`Skipping product 'beforeChange' hook`)
      return newDoc
    }

    if (!data.stripeProductID) {
      if (logs)
        payload.logger.info(
          `No Stripe product assigned to this document, skipping product 'beforeChange' hook`,
        )
      return newDoc
    }

    if (logs) payload.logger.info(`Looking up product from Stripe...`)

    try {
      const stripeProduct = await stripe.products.retrieve(data.stripeProductID)
      if (logs) payload.logger.info(`Found product from Stripe: ${stripeProduct.name}`)
      if (logs) payload.logger.info(`Updating stripe product title and description`)

      const updatedProduct = await stripe.products.update(data.stripeProductID, {
        name: data.title,
        description: data.description ?? undefined,
      })

      if (logs) payload.logger.info(`Updated product stripe product: ${updatedProduct.name}`)
    } catch (error: unknown) {
      payload.logger.error(`Error fetching product from Stripe: ${error}`)
      return newDoc
    }

    if (logs) payload.logger.info(`Looking up price from Stripe...`)

    try {
      if (data.hasVariants) {
        if (logs) payload.logger.info(`Product has variants`)
        data.variants?.map(async (variant) => {
          const price = await stripe.prices.retrieve(variant.stripePriceID ?? '')
          if (price) {
            const variantIndex = (newDoc.variants as any[])?.findIndex(
              (v) => v.stripePriceID === price.id,
            )
            if (variantIndex !== undefined && variantIndex !== -1 && newDoc.variants) {
              ;(newDoc.variants as any[])[variantIndex].priceJSON = JSON.stringify({
                amount: price.unit_amount,
                currency: price.currency,
              })
            }
          }
        })
      } else {
        if (logs)
          payload.logger.info(
            `Product does not have variants, fetching price and setting it in baseVariant`,
          )

        const basePrice = await stripe.prices.list({
          product: data.stripeProductID,
          limit: 1,
        })

        if (!basePrice.data || basePrice.data.length === 0) {
          payload.logger.error(`No base price found for product ${data.stripeProductID}`)
          throw new Error(`No base price found for product ${data.stripeProductID}`)
        }

        newDoc.baseVariant = {
          stripePriceID: basePrice.data[0].id,
          priceJSON: JSON.stringify({
            amount: basePrice.data[0].unit_amount,
            currency: basePrice.data[0].currency,
          }),
        }

        if (newDoc.baseVariant && typeof newDoc.baseVariant === 'object') {
          // (newDoc.baseVariant as BaseVariant).priceJSON = JSON.stringify({
          //   amount: basePrice.data[0].unit_amount,
          //   currency: basePrice.data[0].currency,
          // })
        }
      }
    } catch (error: unknown) {
      payload.logger.error(`Error fetching prices from Stripe: ${error}`)
    }

    return newDoc
  }
}
