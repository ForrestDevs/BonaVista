import { CopyToClipboard, TextField, useField } from '@payloadcms/ui'

export function LinkToPaymentIntent(props: typeof TextField) {
  const { name } = props
  const { value, setValue } = useField({ path: name })

  const href = `https://dashboard.stripe.com/${
    process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
  }payments/${value}`

  return (
    <div>
      <p style={{ marginBottom: '0' }}>
        {typeof name === 'string' ? name : 'Stripe Payment Intent ID'}
      </p>
      <TextField {...props} label="Stripe Payment Intent ID" />
      {Boolean(value) && (
        <div>
          <div>
            <span
              className="label"
              style={{
                color: '#9A9A9A',
              }}
            >
              Manage in Stripe
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
              }customers/${value}`}
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

// export const LinkToPaymentIntent: React.FC<typeof TextField> = (props) => {
//   const { name } = props

//   const { value: stripePaymentIntentID } = useFormFields(([fields]) => fields[name]) || {}

//   const href = `https://dashboard.stripe.com/${
//     process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
//   }payments/${stripePaymentIntentID}`

//   return (
//     <div>
//       {/* <p style={{ marginBottom: '0' }}>
//         {typeof label === 'string' ? label : 'Stripe Payment Intent ID'}
//       </p>
//       <>TEXT FEILD</> */}
//       {/* <Text {...props} label="" /> */}
//       <TextField {...props} label="Stripe Payment Intent ID" />
//       {Boolean(stripePaymentIntentID) && (
//         <div>
//           <div>
//             <span
//               className="label"
//               style={{
//                 color: '#9A9A9A',
//               }}
//             >
//               Manage in Stripe
//             </span>
//             <CopyToClipboard value={href} />
//           </div>
//           <div
//             style={{
//               fontWeight: '600',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             }}
//           >
//             <a
//               href={`https://dashboard.stripe.com/${
//                 process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
//               }customers/${stripePaymentIntentID}`}
//               rel="noreferrer noopener"
//               target="_blank"
//             >
//               {href}
//             </a>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
