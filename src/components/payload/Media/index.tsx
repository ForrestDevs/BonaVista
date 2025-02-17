import React, { Fragment } from 'react'

import type { Props } from './types'

import { Image } from './Image'
import { Video } from './Video'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource, alt } = props

  const isVideo = typeof resource !== 'number' && resource?.mimeType?.includes('video')
  const Tag = (htmlElement as any) || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      {isVideo ? <Video {...props} /> : <Image {...props} />}
    </Tag>
  )
}
