// // import type { InfoType } from '@/payload/collections/Products/ui/types'
// import type { User, Customer, CartItems } from '@payload-types'
// import type { PayloadHandler } from 'payload'
// import { addDataAndFileToRequest } from '@payloadcms/next/utilities'
// import { stripe } from '@payload/stripe'
// import { CUSTOMER_SLUG, USER_SLUG } from '@payload/collections/constants'
// import Stripe from 'stripe'

// // this endpoint creates an `Invoice` with the items in the cart
// // to do this, we loop through the items in the cart and lookup the product in Stripe
// // we then add the price of the product to the total
// // once completed, we pass the `client_secret` of the `PaymentIntent` back to the client which can process the payment
// export const createPaymentIntent: PayloadHandler = async (req) => {
//   const { payload, user, data } = req
//   console.log({ data })

//   const cartFromRequest = data?.cart
//   const emailFromRequest = data?.email

//   if (!user && !emailFromRequest) {
//     return Response.json('A user or an email is required for this transaction.', { status: 401 })
//   }

//   let customer: Customer | undefined
//   let email: string | undefined

//   if (user) {
//     const fullUser = await payload.findByID({
//       id: user.id,
//       collection: USER_SLUG,
//     })

//     if (!fullUser) {
//       return Response.json('User not found', { status: 404 })
//     }

//     email = fullUser.email
//     customer = await payload
//       .find({
//         collection: CUSTOMER_SLUG,
//         where: {
//           account: {
//             equals: user.id,
//           },
//         },
//       })
//       .then((res) => res.docs[0])

//     if (!customer) {
//       // Create a new customer for the user if it doesn't exist
//       customer = await payload.create({
//         collection: CUSTOMER_SLUG,
//         data: {
//           has_account: true,
//           account: user.id,
//           email: fullUser.email,
//         },
//       })
//     }
//   } else if (emailFromRequest) {
//     email = emailFromRequest
//     customer = await payload
//       .find({
//         collection: CUSTOMER_SLUG,
//         where: {
//           email: {
//             equals: email,
//           },
//         },
//       })
//       .then((res) => res.docs[0])

//     if (!customer) {
//       // Create a new customer for the email if it doesn't exist
//       customer = await payload.create({
//         collection: CUSTOMER_SLUG,
//         data: {
//           email: email,
//           has_account: false,
//         },
//       })
//     }
//   }

//   if (!customer) {
//     return Response.json('Unable to create or find customer', { status: 500 })
//   }

//   const cart = (cartFromRequest as { items: CartItems }).items

//   if (!cart && cart?.length > 0) {
//     return Response.json(
//       { error: 'Please provide a cart either directly or from the user.' },
//       { status: 401 },
//     )
//   }

//   try {
//     let stripeCustomerID = customer.stripeCustomerID
//     let stripeCustomer: Stripe.Customer | undefined

//     // If the customer has a Stripe Customer ID, use that
//     if (stripeCustomerID) {
//       stripeCustomer = (await stripe.customers.retrieve(stripeCustomerID)) as Stripe.Customer
//     } else {
//       // Lookup customer in Stripe or create a new one
//       const stripeCustomers = await stripe.customers.list({
//         email: email,
//         limit: 1,
//       })

//       if (stripeCustomers.data.length > 0) {
//         stripeCustomer = stripeCustomers.data[0]
//       } else {
//         stripeCustomer = await stripe.customers.create({
//           email: email,
//         })
//       }

//       stripeCustomerID = stripeCustomer.id

//       // Update the customer in Payload with the Stripe Customer ID
//       await payload.update({
//         collection: CUSTOMER_SLUG,
//         id: customer.id,
//         data: {
//           stripeCustomerID,
//         },
//       })
//     }

//     let total = 0
//     const metadata = []

//     // For each item in cart, calculate the total price
//     await Promise.all(
//       cart?.map(async (item) => {
//         const { product, quantity, variant: variantFromItem } = item

//         if (!quantity || typeof product === 'string') {
//           return null
//         }

//         let price = 0

//         if (variantFromItem) {
//           const variant = product.variants?.variantProducts.find((v) => v.id === variantFromItem)
//           if (variant && typeof variant.price === 'number') {
//             price = variant.price
//           }
//         } else if (typeof product.baseProduct.price === 'number') {
//           price = product.baseProduct.price
//         }

//         metadata.push({
//           product: product.id,
//           quantity,
//           variant: variantFromItem,
//           price,
//         })

//         total += price * quantity

//         return null
//       }),
//     )

//     if (total === 0) {
//       throw new Error('There is nothing to pay for, add some items to your cart and try again.')
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: total,
//       currency: 'usd',
//       customer: stripeCustomerID,
//       metadata: {
//         cart: JSON.stringify(metadata),
//       },
//       payment_method_types: ['card'],
//     })

//     return Response.json({ client_secret: paymentIntent.client_secret }, { status: 200 })
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : 'Unknown error'
//     payload.logger.error(message)

//     return Response.json({ error: message }, { status: 401 })
//   }
// }
