import type { CollectionSlug, LabelFunction, StaticLabel } from 'payload'

export function createRowLabel({
  defaultLabel,
  path,
  relationTo,
}: {
  defaultLabel: LabelFunction | StaticLabel
  path: string
  relationTo?: CollectionSlug
}) {
  return {
    path: '@components/payload/AdminViews/RowLabels',
    clientProps: {
      defaultLabel: defaultLabel,
      path: path,
      relationTo: relationTo,
    },
  }
}
