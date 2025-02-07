import { OrderItems } from '@payload-types'

export type OrderItem = NonNullable<OrderItems[number]>
