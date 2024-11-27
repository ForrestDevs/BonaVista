'use client'

import type { ClientCollectionConfig, PaginatedDocs } from 'payload'
import { getTranslation } from '@payloadcms/translations'
import {
  Button,
  DeleteMany,
  EditMany,
  Gutter,
  ListControls,
  ListHeader,
  ListSelection,
  Pagination,
  PerPage,
  PublishMany,
  RelationshipProvider,
  RenderCustomComponent,
  SelectionProvider,
  StaggeredShimmers,
  Table,
  UnpublishMany,
  useAuth,
  useBulkUpload,
  useEditDepth,
  useListQuery,
  useSearchParams,
  useModal,
  useStepNav,
  useTranslation,
  useWindowInfo,
  ViewDescription,
  useTableColumns,
  useListDrawer,
  useDocumentDrawer,
  useClientFunctions,
  useConfig,
  useActions,
} from '@payloadcms/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatFilesize, isNumber } from 'payload/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Media, MediaFolder } from '@payload-types'
import GridCard from './grid-card'
import MultipleSelector from '@components/ui/multi-select'
import { Folder } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { FolderOption } from '.'
import { RenderComponent } from '@payloadcms/ui/elements/RenderComponent'

const baseClass = 'collection-list'

type MediaListClientProps = {
  folderOptions: FolderOption[]
  params: {
    [key: string]: string | string[]
  }
}

export const MediaListClient: React.FC<MediaListClientProps> = ({
  folderOptions,
  params,
}: MediaListClientProps) => {
  const { user } = useAuth()
  const router = useRouter()
  const { openModal } = useModal()
  // const { i18n, t } = useTranslation()
  const drawerDepth = useEditDepth()
  const { getEntityConfig } = useConfig()
  const { drawerSlug, collectionSlug, setCollectionSlug, setOnSuccess } = useBulkUpload()
  const collectionConfig = getEntityConfig({ collectionSlug }) as ClientCollectionConfig
  const { setStepNav } = useStepNav()
  const { data, defaultLimit, handlePageChange, handlePerPageChange, handleWhereChange } =
    useListQuery()

  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo()

  // const { Actions, setViewActions } = useActions()

  // const { collectionSlug, collectionConfig } = useListInfo()

  // const {
  //   admin: {
      
  //     // components: {
  //     //   afterList,
  //     //   afterListTable,
  //     //   beforeList,
  //     //   beforeListTable,
  //     //   Description,
  //     //   views: {
  //     //     list: { actions },
  //     //   },
  //     // },
  //     description,
      
  //   },
  //   fields,
  //   labels,
  // } = collectionConfig

  let docs = data.docs || []

  // const isUploadCollection = Boolean(collectionConfig.upload)

  // if (isUploadCollection) {
  //   docs = docs?.map((doc) => {
  //     return {
  //       ...doc,
  //       filesize: formatFilesize(doc.filesize),
  //     }
  //   })
  // }

  const [selectedFolders, setSelectedFolders] = useState([])

  const openBulkUpload = useCallback(() => {
    setCollectionSlug(collectionSlug)
    openModal(drawerSlug)
    setOnSuccess(() => router.refresh())
  }, [router, collectionSlug, drawerSlug, openModal, setCollectionSlug, setOnSuccess])

  // useEffect(() => {
  //   if (drawerDepth <= 1) {
  //     setStepNav([
  //       {
  //         label: labels?.plural,
  //       },
  //     ])
  //   }
  // }, [setStepNav, labels, drawerDepth])

  // const isBulkUploadEnabled = isUploadCollection && collectionConfig.upload.bulkUpload

  const [showGrid, setShowGrid] = useState(true)
  const [enableColumns, setEnableColumns] = useState(false)

  const toggleGrid = () => {
    setShowGrid(!showGrid)
    setEnableColumns(!enableColumns)
  }

  // const folderOptions = useMemo(() => {
  //   return folders.docs.map((folder): FolderOption => {
  //     const media = data.docs.filter((doc: Media) =>
  //       doc?.folder?.find(
  //         (f) =>
  //           (typeof f === 'string' && f === folder.id) ||
  //           (typeof f === 'object' && f.id === folder.id),
  //       ),
  //     )

  //     return {
  //       numItems: media?.length || 0,
  //       value: folder.id,
  //       label: folder.name,
  //       id: folder.id,
  //     }
  //   })
  // }, [folders, data.docs])

  const [showFolders, setShowFolders] = useState(true)
  const [selectedFolder, setSelectedFolder] = useState(null)

  const handleFolderClick = (folder: FolderOption) => {
    setSelectedFolder(folder)
    handleWhereChange({
      folder: {
        in: [folder.id],
      },
    })
  }

  const handleFolderClear = () => {
    setSelectedFolder(null)
    handleWhereChange({})
  }

  const [DocumentDrawer, DocumentToggler, { openDrawer, closeDrawer, isDrawerOpen }] =
    useDocumentDrawer({
      collectionSlug: 'media-folders',
      // drawerDepth: 1,
    })

  // useEffect(() => {
  //   const buildWhereQuery = () => {
  //     if (selectedFolders.length === 0) return {}

  //     return {
  //       folder: {
  //         in: selectedFolders.map((f) => f.value),
  //       },
  //     }
  //   }

  //   handleWhereChange(buildWhereQuery())
  // }, [selectedFolders, handleWhereChange])

  return (
    <div className={`${baseClass} ${baseClass}--${collectionSlug}`}>
      {/* <RenderComponent Component={Actions.map((action) => action)} /> */}
      {/* <SetViewActions actions={actions} /> */}
      <div className="absolute top-0 left-50">
        <DocumentDrawer />
      </div>

      <SelectionProvider docs={data.docs} totalDocs={data.totalDocs} user={user}>
        <Gutter className={`${baseClass}__wrap`}>
          {/* {Header || (
            <>
              <ListHeader
                smallBreak={smallBreak}
                t={t}
                newDocumentURL={newDocumentURL}
                openBulkUpload={openBulkUpload}
                collectionConfig={collectionConfig}
                hasCreatePermission={hasCreatePermission}
                i18n={i18n}
                isBulkUploadEnabled={isBulkUploadEnabled}
              />
              {hasCreatePermission && (
                <>
                  <Button
                    aria-label={i18n.t('general:createNewLabel', {
                      label: getTranslation(labels?.singular, i18n),
                    })}
                    buttonStyle="pill"
                    el={'link'}
                    Link={Link}
                    size="small"
                    to={newDocumentURL}
                  >
                    {i18n.t('general:createNew')}
                  </Button>

                  {isBulkUploadEnabled && (
                    <Button
                      aria-label={t('upload:bulkUpload')}
                      buttonStyle="pill"
                      onClick={openBulkUpload}
                      size="small"
                    >
                      {t('upload:bulkUpload')}
                    </Button>
                  )}
                  <Button
                    buttonStyle="pill"
                    size="small"
                    onClick={toggleGrid}
                    aria-label="Toggle View"
                  >
                    {enableColumns ? 'Grid View' : 'Table View'}
                  </Button>
                  <Button
                    buttonStyle="pill"
                    size="small"
                    onClick={() => setShowFolders(!showFolders)}
                  >
                    {showFolders ? 'Hide Folders' : 'Show Folders'}
                  </Button>
                </>
              )}
              {!smallBreak && (
                <ListSelection label={getTranslation(collectionConfig.labels.plural, i18n)} />
              )}
              {(description || Description) && (
                <div className={`${baseClass}__sub-header`}>
                  <ViewDescription description={description} />
                </div>
              )}
            </>
          )} */}
          <ListControls
            collectionSlug={collectionSlug}
            collectionConfig={collectionConfig}
            enableColumns={enableColumns}
          />
          {/* <RenderComponent Component={beforeListTable} /> */}

          {!data.docs && (
            <StaggeredShimmers
              className={[`${baseClass}__shimmer`, `${baseClass}__shimmer--rows`].join(' ')}
              count={6}
            />
          )}

          {/* <MultipleSelector
            options={folderOptions}
            value={selectedFolders}
            onChange={setSelectedFolders}
            placeholder="Filter by folders..."
          /> */}

          <div className="flex flex-col space-y-8">
            {folderOptions?.length > 0 && showFolders && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-start gap-4">
                  {selectedFolder ? (
                    <>
                      <Button buttonStyle="pill" size="small" onClick={handleFolderClear}>
                        Back
                      </Button>
                      <h2 className="text-3xl font-medium">
                        {selectedFolder.label} ({selectedFolder.numItems} items)
                      </h2>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-medium">Folders</h2>
                      <DocumentToggler drawerSlug="media-folders" />
                      <Button buttonStyle="pill" size="small" onClick={openDrawer}>
                        Create Folder
                      </Button>
                    </>
                  )}
                </div>

                {!selectedFolder && (
                  <div className="flex flex-wrap gap-4">
                    {folderOptions.map((folder, index) => (
                      <Card
                        key={index}
                        className="bg-background text-foreground hover:bg-muted/50 transition-colors cursor-pointer rounded-xl shadow-lg"
                        onClick={() => handleFolderClick(folder)}
                      >
                        <CardHeader>
                          <div className="w-10 h-10 flex items-center justify-center">
                            <Folder className="w-full h-full text-zinc-400" />
                          </div>
                        </CardHeader>
                        <CardContent className="border border-red-400">
                          <CardTitle>{folder.label}</CardTitle>
                          <CardDescription>{folder.numItems} items</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showGrid
              ? data.docs &&
                data.docs.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {!selectedFolder && <h2 className="text-3xl font-medium">Documents</h2>}
                    <RelationshipProvider>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {data.docs.map((gridCell: Media, cellIndex) => (
                          <GridCard
                            key={cellIndex}
                            data={gridCell}
                            collectionSlug={collectionSlug}
                          />
                        ))}
                      </div>
                    </RelationshipProvider>
                  </div>
                )
              : data.docs &&
                data.docs.length > 0 && (
                  <RelationshipProvider>
                    <Table data={docs} />
                  </RelationshipProvider>
                )}
          </div>

          {data.docs && data.docs.length === 0 && (
            <div className={`${baseClass}__no-results`}>
              {/* <p>{i18n.t('general:noResults', { label: getTranslation(labels?.plural, i18n) })}</p> */}
              {/* {hasCreatePermission && newDocumentURL && (
                <Button el="link" Link={Link} to={newDocumentURL}>
                  {i18n.t('general:createNewLabel', {
                    label: getTranslation(labels?.singular, i18n),
                  })}
                </Button>
              )} */}
            </div>
          )}
          {/* <RenderComponent Component={afterListTable} /> */}
          {data.docs && data.docs.length > 0 && (
            <div className={`${baseClass}__page-controls`}>
              <Pagination
                hasNextPage={data.hasNextPage}
                hasPrevPage={data.hasPrevPage}
                limit={data.limit}
                nextPage={data.nextPage}
                numberOfNeighbors={1}
                onChange={(page) => void handlePageChange(page)}
                page={data.page}
                prevPage={data.prevPage}
                totalPages={data.totalPages}
              />
              {data?.totalDocs > 0 && (
                <Fragment>
                  <div className={`${baseClass}__page-info`}>
                    {data.page * data.limit - (data.limit - 1)}-
                    {data.totalPages > 1 && data.totalPages !== data.page
                      ? data.limit * data.page
                      : data.totalDocs}{' '}
                    {/* {i18n.t('general:of')} {data.totalDocs} */}
                  </div>
                  <PerPage
                    handleChange={(limit) => void handlePerPageChange(limit)}
                    limit={isNumber(params?.limit) ? Number(params.limit) : defaultLimit}
                    limits={collectionConfig?.admin?.pagination?.limits}
                    resetPage={data.totalDocs <= data.pagingCounter}
                  />
                  {smallBreak && (
                    <div className={`${baseClass}__list-selection`}>
                      {/* <ListSelection label={getTranslation(collectionConfig.labels.plural, i18n)} /> */}
                      <div className={`${baseClass}__list-selection-actions`}>
                        {/* {beforeActions && beforeActions} */}
                        {/* {!disableBulkEdit && (
                          <Fragment>
                            <EditMany collection={collectionConfig} />
                            <PublishMany collection={collectionConfig} />
                            <UnpublishMany collection={collectionConfig} />
                          </Fragment>
                        )} */}
                        {/* {!disableBulkDelete && <DeleteMany collection={collectionConfig} />} */}
                      </div>
                    </div>
                  )}
                </Fragment>
              )}
            </div>
          )}
        </Gutter>
        {/* {afterList && <RenderComponent Component={afterList} />} */}
      </SelectionProvider>
    </div>
  )
}

// <div key={cellIndex}>
//                         {filenameField && (
//                           <Link
//                             // className={`${baseClass}__cells__cell__filename`}
//                             href={`${collectionSlug}/${gridCell.id}`}
//                           >
//                             {gridCell.filename}
//                           </Link>
//                         )}
//                         {selectorField && (
//                           <div className={`${baseClass}__cells__cell__selector`}>
//                             <RenderComponent
//                               clientProps={gridCell}
//                               mappedComponent={selectorField.cellProps.field.admin.components.Cell}
//                             />
//                           </div>
//                         )}
//                         {columnsFromContext.map((col) => (
//                           <div key={col.accessor}>{col.accessor}</div>
//                         ))}
//                         {/* <SelectRow /> */}
//                         {/* <>Foo</> */}

//                         <Button
//                           //   key={doc.id}
//                           // to={`${adminRoute}/collections/${collectionSlug}/${doc.id}`}
//                           // el="link"
//                           //   onClick={(e) => e.stopPropagation()}
//                           // Link={Link}
//                           //   onClick={}
//                           buttonStyle="none"
//                           className="relative flex flex-col max-h-[300px] border-2 border-[#1f1f1f] hover:border-[#2f2f2f] transition-colors duration-200"
//                         >
//                           {/* <div
//                         className="absolute top-2 left-2 z-10"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         TODO: Selecting single row doesnt work as cant provide ID to it now it is provided by provider.
//                         <SelectRow />
//                       </div> */}

//                         </Button>
//                       </div>
