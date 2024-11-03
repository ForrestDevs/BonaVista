'use client'
import React, { useState } from 'react'

import {
  useConfig,
  useDocumentDrawer,
  useListDrawer,
  useSelection,
  useTableColumns,
  useTranslation,
} from '@payloadcms/ui'
import { Button } from '@/components/ui/button'
import { Media } from '@payload-types'
import { useRouter } from 'next/navigation'
// import { Checkbox } from '@/components/ui/checkbox'
import { formatFilesize } from 'payload/shared'
import { formatDate } from '@payloadcms/ui/utilities/formatDate'
import Image from 'next/image'
import { FileIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils/cn'

export default function GridCard({
  data,
  collectionSlug,
}: {
  data: Media
  collectionSlug: string
}) {
  const router = useRouter()
  const { config } = useConfig()
  const { i18n, t } = useTranslation()
  const tableColumns = useTableColumns()
  const { setSelection, selected } = useSelection()

  const {
    routes: { admin: adminRoute },
    admin: { dateFormat },
  } = config

  // IF this field is present we can present the checkbox,
  // but also note that the onClick and link cell props will be shifted to index 1
  const selectorField = tableColumns.columns.find((col) => col.accessor === '_select')

  const handleItemClicked = () => {
    const onClick = selectorField
      ? tableColumns.cellProps?.[1]?.onClick
      : tableColumns.cellProps?.[0]?.onClick

    if (typeof onClick === 'function') {
      // we are in "list-drawer" view, execute the onClick function
      onClick({
        cellData: undefined,
        collectionSlug: collectionSlug,
        rowData: data,
      })
    } else {
      // we are in "collection-admin" view, push the new route with next/navigation
      void router.push(`${adminRoute}/collections/${collectionSlug}/${data.id}`)
    }
  }

  return (
    <div className="w-full overflow-hidden shadow-lg">
      <div className="aspect-square relative">
        <div className="absolute inset-0 cursor-pointer group" onClick={() => handleItemClicked()}>
          {data.mimeType?.includes('image') ? (
            <div className="w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:opacity-80">
              <Image
                src={data.url}
                alt={data.filename}
                fill
                className="object-cover"
                quality={80}
              />
            </div>
          ) : data.mimeType?.includes('video') ? (
            <div className="w-full h-full transition-all duration-300 group-hover:scale-110 group-hover:opacity-80">
              <video
                src={data.url!}
                autoPlay={true}
                muted={true}
                loop={true}
                playsInline={true}
                controls={false}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 transition-all duration-300 group-hover:opacity-80">
              <FileIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between gap-y-2">
        <div>
          <h3 className="font-semibold text-lg truncate" title={data.filename}>
            {data.filename}
          </h3>
          <div className="text-sm text-gray-500 space-y-1">
            <p className="break-words">{formatFilesize(data.filesize!)}</p>
            <p className="break-words font-light opacity-50">
              {formatDate({
                date: data.createdAt,
                pattern: dateFormat,
                i18n: i18n,
              })}
            </p>
          </div>
        </div>

        {selectorField && (
          <Button
            size="icon"
            variant="outline"
            onClick={() => setSelection(data.id)}
            className="cursor-pointer"
          >
            <div
              className={cn(
                'transition-all',
                Boolean(selected?.get(data.id)) ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="fill-primary"
                  d="M14.548 3.488a.75.75 0 0 1-.036 1.06l-8.572 8a.75.75 0 0 1-1.023 0l-3.429-3.2a.75.75 0 0 1 1.024-1.096l2.917 2.722 8.06-7.522a.75.75 0 0 1 1.06.036Z"
                />
              </svg>
            </div>
          </Button>
        )}
      </div>
    </div>
  )
}
