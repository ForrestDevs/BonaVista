'use server'

import jwt from 'jsonwebtoken'
import { draftMode } from 'next/headers'
import { CollectionSlug } from 'payload'
import getPayload from '@/lib/utils/getPayload'
import { cookies as nextCookies } from 'next/headers'

export async function previewAction(url: string): Promise<string | null> {
  const payload = await getPayload()
  console.log(url)
  const { searchParams } = new URL(url)
  console.log(searchParams)

  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug
  const slug = searchParams.get('slug')
  const previewSecret = searchParams.get('previewSecret')

  console.log('prev: ', previewSecret, 'secret: ', process.env.NEXT_PUBLIC_DRAFT_SECRET)

  if (previewSecret !== process.env.NEXT_PUBLIC_DRAFT_SECRET) {
    payload.logger.error({ status: 403 }, 'You are not allowed to preview this page', {
      previewSecret,
    })
    return null
  }

  if (!path || !collection || !slug) {
    payload.logger.error({ status: 404 }, 'Insufficient search params')
    return null
  }

  if (!path.startsWith('/')) {
    payload.logger.error({ status: 500 }, 'This endpoint can only be used for relative previews')
    return null
  }

  let user

  const cookies = await nextCookies()
  const token = cookies.get('payload-token')?.value

  try {
    user = jwt.verify(token, payload.secret)
  } catch (error) {
    payload.logger.error({ err: error }, 'Error verifying token for live preview')
    return null
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return null
  }

  draft.enable()

  return path
}
