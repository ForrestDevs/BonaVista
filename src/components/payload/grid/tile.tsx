import type { Media as MediaType } from '@payload-types'

import { Media } from '@components/payload/Media'
import clsx from 'clsx'
import React from 'react'
import Label from '../Label'

export function GridTileImage({
  active,
  isInteractive = true,
  label,
  ...props
}: {
  active?: boolean
  isInteractive?: boolean
  label?: {
    amount: number
    currencyCode: string
    position?: 'bottom' | 'center'
    title: string
  }
  media: MediaType
}) {
  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black',
        {
          'border-2 border-blue-600': active,
          'border-neutral-200 dark:border-neutral-800': !active,
          relative: label,
        },
      )}
    >
      {props.media ? (
        <Media
          className={clsx('relative h-full w-full object-cover', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive,
          })}
          height={80}
          imgClassName="h-full w-full object-cover"
          resource={props.media}
          width={80}
        />
      ) : null}
      {label ? (
        <Label
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
          title={label.title}
        />
      ) : null}
    </div>
  )
}
