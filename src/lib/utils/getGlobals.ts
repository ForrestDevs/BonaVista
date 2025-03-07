import type { Config } from '@payload-types'
import { unstable_cache } from 'next/cache'
import getPayload from './getPayload'
import { cache } from './cache'

type Global = keyof Config['globals']

export async function getGlobal<T extends Global>(
  slug: T,
  depth = 1,
): Promise<Config['globals'][T] | null> {
  const payload = await getPayload()

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export async function getCachedGlobal<T extends Global>(slug: T, depth?: number) {
  const cacheFn = cache(
    async () => getGlobal<T>(slug, depth),
    {
      tags: [`global_${slug}`],
    },
    [`global_${slug}`],
  )

  return await cacheFn()
}
