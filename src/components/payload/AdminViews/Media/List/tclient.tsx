// 'use client'

// import React, { Fragment, useEffect, useState } from 'react'
// import { ListViewClientProps } from './text'
// import {
//   DeleteMany,
//   EditMany,
//   Gutter,
//   ListControls,
//   ListHeader,
//   ListSelection,
//   Pagination,
//   PerPage,
//   PublishMany,
//   RelationshipProvider,
//   RenderCustomComponent,
//   SelectionProvider,
//   UnpublishMany,
//   useAuth,
//   useBulkUpload,
//   useConfig,
//   useEditDepth,
//   useListDrawerContext,
//   useListQuery,
//   useModal,
//   useStepNav,
//   useTranslation,
//   useWindowInfo,
//   ViewDescription,
// } from '@payloadcms/ui'
// import { useRouter } from 'next/navigation'
// import { ClientCollectionConfig } from 'payload'
// import { formatFilesize, isNumber } from 'payload/shared'
// import { TableColumnsProvider } from '@payloadcms/ui/elements/TableColumns'
// import { getTranslation } from '@payloadcms/translations'
// import { SelectMany } from '@payloadcms/ui/elements/SelectMany'
// import { Button } from '@payloadcms/ui/elements/Button'
// import Link from 'next/link'

// const baseClass = 'collection-list'

// export default function TestClient(props: ListViewClientProps) {
//   const {
//     AfterList,
//     AfterListTable,
//     beforeActions,
//     BeforeList,
//     BeforeListTable,
//     collectionSlug,
//     columnState,
//     Description,
//     disableBulkDelete,
//     disableBulkEdit,
//     enableRowSelections,
//     hasCreatePermission,
//     listPreferences,
//     newDocumentURL,
//     preferenceKey,
//     renderedFilters,
//     Table: InitialTable,
//   } = props

//   const [Table, setTable] = useState(InitialTable)
//   const { createNewDrawerSlug, drawerSlug: listDrawerSlug, onBulkSelect } = useListDrawerContext()
//   useEffect(() => {
//     if (InitialTable) {
//       setTable(InitialTable)
//     }
//   }, [InitialTable])
//   const { user } = useAuth()
//   const { config } = useConfig()
//   const router = useRouter()
//   const {
//     data,
//     defaultLimit: initialLimit,
//     handlePageChange,
//     handlePerPageChange,
//     query,
//   } = useListQuery()
//   const { openModal } = useModal()
//   const { setCollectionSlug, setOnSuccess } = useBulkUpload()
//   const { drawerSlug: bulkUploadDrawerSlug} = useBulkUpload()
//   // const collectionConfig = getEntityConfig({ collectionSlug }) as ClientCollectionConfig
//   const { labels, upload } = config

//   const isUploadCollection = Boolean(upload)

//   const isBulkUploadEnabled = isUploadCollection && config.upload.

//   const isInDrawer = Boolean(listDrawerSlug)

//   const { i18n, t } = useTranslation()

//   const drawerDepth = useEditDepth()

//   const { setStepNav } = useStepNav()

//   const {
//     breakpoints: { s: smallBreak },
//   } = useWindowInfo()

//   const docs = React.useMemo(() => {
//     if (isUploadCollection) {
//       return data.docs.map((doc) => {
//         return {
//           ...doc,
//           filesize: formatFilesize(doc.filesize),
//         }
//       })
//     } else {
//       return data.docs
//     }
//   }, [data.docs, isUploadCollection])

//   const openBulkUpload = React.useCallback(() => {
//     setCollectionSlug(collectionSlug)
//     openModal(bulkUploadDrawerSlug)
//     setOnSuccess(() => router.refresh())
//   }, [router, collectionSlug, bulkUploadDrawerSlug, openModal, setCollectionSlug, setOnSuccess])

//   useEffect(() => {
//     if (drawerDepth <= 1) {
//       setStepNav([
//         {
//           label: labels?.plural,
//         },
//       ])
//     }
//   }, [setStepNav, labels, drawerDepth])

//   return (
//     <>
//       <TableColumnsProvider
//         collectionSlug={collectionSlug}
//         columnState={columnState}
//         docs={docs}
//         enableRowSelections={enableRowSelections}
//         listPreferences={listPreferences}
//         preferenceKey={preferenceKey}
//         setTable={setTable}
//       >
//         <div className={`${baseClass} ${baseClass}--${collectionSlug}`}>
//           <SelectionProvider docs={docs} totalDocs={data.totalDocs} user={user}>
//             {BeforeList}
//             <Gutter className={`${baseClass}__wrap`}>
//               <ListHeader
//                 collectionConfig={collectionConfig}
//                 Description={
//                   <div className={`${baseClass}__sub-header`}>
//                     <RenderCustomComponent
//                       CustomComponent={Description}
//                       Fallback={
//                         <ViewDescription description={collectionConfig?.admin?.description} />
//                       }
//                     />
//                   </div>
//                 }
//                 hasCreatePermission={hasCreatePermission}
//                 i18n={i18n}
//                 isBulkUploadEnabled={isBulkUploadEnabled}
//                 newDocumentURL={newDocumentURL}
//                 openBulkUpload={openBulkUpload}
//                 smallBreak={smallBreak}
//                 t={t}
//               />
//               <ListControls
//                 beforeActions={
//                   enableRowSelections && typeof onBulkSelect === 'function'
//                     ? beforeActions
//                       ? [...beforeActions, <SelectMany key="select-many" onClick={onBulkSelect} />]
//                       : [<SelectMany key="select-many" onClick={onBulkSelect} />]
//                     : beforeActions
//                 }
//                 collectionConfig={collectionConfig}
//                 collectionSlug={collectionSlug}
//                 disableBulkDelete={disableBulkDelete}
//                 disableBulkEdit={disableBulkEdit}
//                 renderedFilters={renderedFilters}
//               />
//               {BeforeListTable}
//               {docs.length > 0 && <RelationshipProvider>{Table}</RelationshipProvider>}
//               {docs.length === 0 && (
//                 <div className={`${baseClass}__no-results`}>
//                   <p>
//                     {i18n.t('general:noResults', { label: getTranslation(labels?.plural, i18n) })}
//                   </p>
//                   {hasCreatePermission && newDocumentURL && (
//                     <Fragment>
//                       {isInDrawer ? (
//                         <Button el="button" onClick={() => openModal(createNewDrawerSlug)}>
//                           {i18n.t('general:createNewLabel', {
//                             label: getTranslation(labels?.singular, i18n),
//                           })}
//                         </Button>
//                       ) : (
//                         <Button el="link" Link={Link} to={newDocumentURL}>
//                           {i18n.t('general:createNewLabel', {
//                             label: getTranslation(labels?.singular, i18n),
//                           })}
//                         </Button>
//                       )}
//                     </Fragment>
//                   )}
//                 </div>
//               )}
//               {AfterListTable}
//               {docs.length > 0 && (
//                 <div className={`${baseClass}__page-controls`}>
//                   <Pagination
//                     hasNextPage={data.hasNextPage}
//                     hasPrevPage={data.hasPrevPage}
//                     limit={data.limit}
//                     nextPage={data.nextPage}
//                     numberOfNeighbors={1}
//                     onChange={(page) => void handlePageChange(page)}
//                     page={data.page}
//                     prevPage={data.prevPage}
//                     totalPages={data.totalPages}
//                   />
//                   {data.totalDocs > 0 && (
//                     <Fragment>
//                       <div className={`${baseClass}__page-info`}>
//                         {data.page * data.limit - (data.limit - 1)}-
//                         {data.totalPages > 1 && data.totalPages !== data.page
//                           ? data.limit * data.page
//                           : data.totalDocs}{' '}
//                         {i18n.t('general:of')} {data.totalDocs}
//                       </div>
//                       <PerPage
//                         handleChange={(limit) => void handlePerPageChange(limit)}
//                         limit={isNumber(query?.limit) ? Number(query.limit) : initialLimit}
//                         limits={collectionConfig?.admin?.pagination?.limits}
//                         resetPage={data.totalDocs <= data.pagingCounter}
//                       />
//                       {smallBreak && (
//                         <div className={`${baseClass}__list-selection`}>
//                           <ListSelection
//                             label={getTranslation(collectionConfig.labels.plural, i18n)}
//                           />
//                           <div className={`${baseClass}__list-selection-actions`}>
//                             {enableRowSelections && typeof onBulkSelect === 'function'
//                               ? beforeActions
//                                 ? [
//                                     ...beforeActions,
//                                     <SelectMany key="select-many" onClick={onBulkSelect} />,
//                                   ]
//                                 : [<SelectMany key="select-many" onClick={onBulkSelect} />]
//                               : beforeActions}
//                             {!disableBulkEdit && (
//                               <Fragment>
//                                 <EditMany collection={collectionConfig} />
//                                 <PublishMany collection={collectionConfig} />
//                                 <UnpublishMany collection={collectionConfig} />
//                               </Fragment>
//                             )}
//                             {!disableBulkDelete && <DeleteMany collection={collectionConfig} />}
//                           </div>
//                         </div>
//                       )}
//                     </Fragment>
//                   )}
//                 </div>
//               )}
//             </Gutter>
//             {AfterList}
//           </SelectionProvider>
//         </div>
//       </TableColumnsProvider>
//     </>
//   )
// }
