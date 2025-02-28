import { LineItems } from '@payload-types'

export type OrderItem = NonNullable<LineItems[number]['lineItem']>
