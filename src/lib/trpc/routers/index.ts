import { router } from '@/lib/trpc'
import { orderRouter } from '@/lib/trpc/routers/order'
import { authorRouter } from '@/lib/trpc/routers/author'
import { postRouter } from '@/lib/trpc/routers/post'
import { pageRouter } from '@/lib/trpc/routers/page'
import { siteSettingsRouter } from '@/lib/trpc/routers/site-settings'
import { tagRouter } from '@/lib/trpc/routers/tag'
import { productRouter } from '@/lib/trpc/routers/product'

export const appRouter = router({
  order: orderRouter,
  product: productRouter,
  page: pageRouter,
  post: postRouter,
  siteSettings: siteSettingsRouter,
  tag: tagRouter,
  author: authorRouter,
})

export type AppRouter = typeof appRouter
