// import { CodeBlock } from '@/components/payload/blocks/Code'
// import { Code } from '@/payload/blocks/Code'
// import {
//   DefaultListViewProps,
//   ListComponentClientProps,
//   ListComponentServerProps,
//   ListPreferences,
// } from 'node_modules/@payloadcms/ui/dist/views/List/types'
// import { Column } from '@payloadcms/ui'
// import { ClientCollectionConfig, ServerComponentProps } from 'payload'
// import TestClient from './tclient'

// export type ListViewSlots = {
//   AfterList?: React.ReactNode
//   AfterListTable?: React.ReactNode
//   BeforeList?: React.ReactNode
//   BeforeListTable?: React.ReactNode
//   Description?: React.ReactNode
//   Table: React.ReactNode
// }

// export type ListViewClientProps = {
//   beforeActions?: React.ReactNode[]
//   collectionSlug: string
//   columnState: Column[]
//   disableBulkDelete?: boolean
//   disableBulkEdit?: boolean
//   enableRowSelections?: boolean
//   hasCreatePermission: boolean
//   listPreferences?: ListPreferences
//   newDocumentURL: string
//   preferenceKey?: string
//   renderedFilters?: Map<string, React.ReactNode>
// //   collectionConfig: ClientCollectionConfig
// } & ListViewSlots

// interface ListProps extends ListViewClientProps, ServerComponentProps {}

// export default async function Test(props: ListProps) {
//   const clientProps: ListViewClientProps = {
//     // beforeActions: props.beforeActions,
//     collectionSlug: 'media',
//     columnState: props.columnState,
//     hasCreatePermission: props.hasCreatePermission,
//     newDocumentURL: props.newDocumentURL,
//     Table: props.Table,
//     AfterList: props.AfterList,
//     AfterListTable: props.AfterListTable,
//     BeforeList: props.BeforeList,
//     BeforeListTable: props.BeforeListTable,
//     Description: props.Description,
    
//     // collectionConfig: props.,
//   }

//   return <TestClient {...clientProps} />
// }

// // const props = {
// //     collectionSlug: 'media',
// //     hasCreatePermission: true,
// //     newDocumentURL: '/admin/collections/media/create',
// //     columnState: [
// //       {
// //         accessor: '_select',
// //         active: true,
// //         field: null,
// //         Heading: [Object],
// //         renderedCells: [Array]
// //       },
// //       {
// //         accessor: 'filename',
// //         active: true,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: [Array]
// //       },
// //       {
// //         accessor: 'folder',
// //         active: true,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: [Array]
// //       },
// //       {
// //         accessor: 'alt',
// //         active: true,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: [Array]
// //       },
// //       {
// //         accessor: 'caption',
// //         active: true,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: [Array]
// //       },
// //       {
// //         accessor: 'id',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'updatedAt',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'createdAt',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'url',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'thumbnailURL',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'mimeType',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'filesize',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'width',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'height',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'focalX',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'focalY',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       },
// //       {
// //         accessor: 'sizes',
// //         active: undefined,
// //         CustomLabel: undefined,
// //         field: [Object],
// //         Heading: [Object],
// //         renderedCells: []
// //       }
// //     ],
// //     enableRowSelections: true,
// //     listPreferences: { limit: 100, sort: null },
// //     renderedFilters: Map(0) {},
// //     Table: {
// //       '$$typeof': Symbol(react.transitional.element),
// //       type: [Function (anonymous)],
// //       key: null,
// //       props: { appearance: undefined, columns: [Array], data: [Array] },
// //       _owner: {
// //         name: 'ListView',
// //         env: 'Server',
// //         key: null,
// //         owner: [Object],
// //         props: [Object]
// //       },
// //       _store: {}
// //     },
// //     collectionConfig: {
// //       access: {
// //         create: [Function: authenticated],
// //         delete: [Function: authenticated],
// //         read: [Function: anyone],
// //         unlock: [Function: __TURBOPACK__default__export__],
// //         update: [Function: authenticated]
// //       },
// //       admin: {
// //         components: [Object],
// //         custom: {},
// //         enableRichTextLink: true,
// //         enableRichTextRelationship: true,
// //         pagination: [Object],
// //         useAsTitle: 'filename'
// //       },
// //       auth: false,
// //       custom: {},
// //       endpoints: [],
// //       fields: [
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object]
// //       ],
// //       hooks: {
// //         afterChange: [],
// //         afterDelete: [Array],
// //         afterForgotPassword: [],
// //         afterLogin: [],
// //         afterLogout: [],
// //         afterMe: [],
// //         afterOperation: [],
// //         afterRead: [],
// //         afterRefresh: [],
// //         beforeChange: [Array],
// //         beforeDelete: [],
// //         beforeLogin: [],
// //         beforeOperation: [],
// //         beforeRead: [],
// //         beforeValidate: [Array],
// //         me: [],
// //         refresh: []
// //       },
// //       timestamps: true,
// //       upload: {
// //         adminThumbnail: 'thumbnail',
// //         imageSizes: [Array],
// //         formatOptions: [Object],
// //         resizeOptions: [Object],
// //         bulkUpload: true,
// //         disableLocalStorage: true,
// //         focalPoint: true,
// //         crop: true,
// //         adapter: 's3',
// //         handlers: [Array],
// //         staticDir: 'media'
// //       },
// //       versions: false,
// //       slug: 'media',
// //       labels: { plural: 'Media', singular: 'Media' },
// //       joins: {},
// //       flattenedFields: [
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object], [Object],
// //         [Object]
// //       ]
// //     },
// //     i18n: {
// //       dateFNS: {
// //         code: 'en-US',
// //         formatDistance: [Function: formatDistance],
// //         formatLong: [Object],
// //         formatRelative: [Function: formatRelative],
// //         localize: [Object],
// //         match: [Object],
// //         options: [Object]
// //       },
// //       dateFNSKey: 'en-US',
// //       fallbackLanguage: 'en',
// //       language: 'en',
// //       t: [Function: t],
// //       translations: {
// //         authentication: [Object],
// //         error: [Object],
// //         fields: [Object],
// //         general: [Object],
// //         operators: [Object],
// //         upload: [Object],
// //         validation: [Object],
// //         version: [Object],
// //         '$schema': './translation-schema.json',
// //         'plugin-seo': [Object],
// //         lexical: [Object]
// //       }
// //     },
// //     limit: 100,
// //     // payload: <ref *1> BasePayload {
// //     //   auth: [AsyncFunction: auth],
// //     //   authStrategies: [ [Object] ],
// //     //   collections: {
// //     //     address: [Object],
// //     //     'blog-categories': [Object],
// //     //     media: [Object],
// //     //     users: [Object],
// //     //     cart: [Object],
// //     //     orders: [Object],
// //     //     products: [Object],
// //     //     'shop-collections': [Object],
// //     //     pages: [Object],
// //     //     posts: [Object],
// //     //     'product-categories': [Object],
// //     //     brands: [Object],
// //     //     customers: [Object],
// //     //     testimonials: [Object],
// //     //     spas: [Object],
// //     //     galleries: [Object],
// //     //     'media-folders': [Object],
// //     //     redirects: [Object],
// //     //     forms: [Object],
// //     //     'form-submissions': [Object],
// //     //     'payload-locked-documents': [Object],
// //     //     'payload-preferences': [Object],
// //     //     'payload-migrations': [Object]
// //     //   },
// //     //   config: {
// //     //     admin: [Object],
// //     //     bin: [],
// //     //     collections: [Array],
// //     //     cookiePrefix: 'payload',
// //     //     cors: [Array],
// //     //     csrf: [Array],
// //     //     custom: {},
// //     //     defaultDepth: 2,
// //     //     defaultMaxTextLength: 40000,
// //     //     endpoints: [Array],
// //     //     globals: [Array],
// //     //     graphQL: [Object],
// //     //     hooks: {},
// //     //     i18n: [Object],
// //     //     jobs: [Object],
// //     //     localization: false,
// //     //     maxDepth: 10,
// //     //     routes: [Object],
// //     //     serverURL: '',
// //     //     telemetry: true,
// //     //     typescript: [Object],
// //     //     upload: [Object],
// //     //     editor: [Object],
// //     //     db: [Object],
// //     //     plugins: [Array],
// //     //     secret: 'e1d92de4f2129bd75ca92584',
// //     //     sharp: [Function],
// //     //     onInit: [AsyncFunction: onInit],
// //     //     loggingLevels: [Object]
// //     //   },
// //     //   count: [AsyncFunction: count],
// //     //   countGlobalVersions: [AsyncFunction: countGlobalVersions],
// //     //   countVersions: [AsyncFunction: countVersions],
// //     //   create: [AsyncFunction: create],
// //     //   db: {
// //     //     beginTransaction: [AsyncFunction: beginTransaction],
// //     //     commitTransaction: [AsyncFunction: commitTransaction],
// //     //     createMigration: [AsyncFunction: createMigration],
// //     //     migrate: [AsyncFunction: migrate],
// //     //     migrateDown: [AsyncFunction: migrateDown],
// //     //     migrateFresh: [AsyncFunction: migrateFresh],
// //     //     migrateRefresh: [AsyncFunction: migrateRefresh],
// //     //     migrateReset: [AsyncFunction: migrateReset],
// //     //     migrateStatus: [AsyncFunction: migrateStatus],
// //     //     rollbackTransaction: [AsyncFunction: rollbackTransaction],
// //     //     name: 'mongoose',
// //     //     autoPluralization: true,
// //     //     collections: [Object],
// //     //     connection: [NativeConnection],
// //     //     connectOptions: {},
// //     //     disableIndexHints: false,
// //     //     ensureIndexes: undefined,
// //     //     globals: Model { globals },
// //     //     mongoMemoryServer: undefined,
// //     //     sessions: {},
// //     //     transactionOptions: {},
// //     //     url: 'mongodb+srv://adminUser:adminPassword@bvcluster.rj022dr.mongodb.net/?retryWrites=true&w=majority&appName=bvCluster',
// //     //     versions: [Object],
// //     //     connect: [AsyncFunction: connect],
// //     //     count: [AsyncFunction: count],
// //     //     countGlobalVersions: [AsyncFunction: countGlobalVersions],
// //     //     countVersions: [AsyncFunction: countVersions],
// //     //     create: [AsyncFunction: create],
// //     //     createGlobal: [AsyncFunction: createGlobal],
// //     //     createGlobalVersion: [AsyncFunction: createGlobalVersion],
// //     //     createVersion: [AsyncFunction: createVersion],
// //     //     defaultIDType: 'text',
// //     //     deleteMany: [AsyncFunction: deleteMany],
// //     //     deleteOne: [AsyncFunction: deleteOne],
// //     //     deleteVersions: [AsyncFunction: deleteVersions],
// //     //     destroy: [AsyncFunction: destroy],
// //     //     find: [AsyncFunction: find],
// //     //     findGlobal: [AsyncFunction: findGlobal],
// //     //     findGlobalVersions: [AsyncFunction: findGlobalVersions],
// //     //     findOne: [AsyncFunction: findOne],
// //     //     findVersions: [AsyncFunction: findVersions],
// //     //     init: [Function: init],
// //     //     migrationDir: '/Users/forrestdevs/dev/bonavista-v2/src/migrations',
// //     //     packageName: '@payloadcms/db-mongodb',
// //     //     payload: [Circular *1],
// //     //     prodMigrations: undefined,
// //     //     queryDrafts: [AsyncFunction: queryDrafts],
// //     //     updateGlobal: [AsyncFunction: updateGlobal],
// //     //     updateGlobalVersion: [AsyncFunction: updateGlobalVersion],
// //     //     updateOne: [AsyncFunction: updateOne],
// //     //     updateVersion: [AsyncFunction: updateVersion],
// //     //     upsert: [AsyncFunction: upsert]
// //     //   },
// //     //   decrypt: [Function: decrypt],
// //     //   duplicate: [AsyncFunction: duplicate],
// //     //   email: {
// //     //     name: 'console',
// //     //     defaultFromAddress: 'info@payloadcms.com',
// //     //     defaultFromName: 'Payload',
// //     //     sendEmail: [AsyncFunction: sendEmail]
// //     //   },
// //     //   encrypt: [Function: encrypt],
// //     //   extensions: undefined,
// //     //   find: [AsyncFunction: find],
// //     //   findByID: [AsyncFunction: findByID],
// //     //   findGlobal: [AsyncFunction: findGlobal],
// //     //   findGlobalVersionByID: [AsyncFunction: findGlobalVersionByID],
// //     //   findGlobalVersions: [AsyncFunction: findGlobalVersions],
// //     //   findVersionByID: [AsyncFunction: findVersionByID],
// //     //   findVersions: [AsyncFunction: findVersions],
// //     //   forgotPassword: [AsyncFunction: forgotPassword],
// //     //   getAdminURL: [Function: getAdminURL],
// //     //   getAPIURL: [Function: getAPIURL],
// //     //   globals: { config: [Array] },
// //     //   importMap: {
// //     //     'src/payload/fields/slug/SlugComponent#SlugComponent': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell': [Function: RscEntryLexicalCell],
// //     //     '@payloadcms/richtext-lexical/rsc#RscEntryLexicalField': [AsyncFunction: RscEntryLexicalField],
// //     //     '@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#FixedToolbarFeatureClient': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#AlignFeatureClient': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#IndentFeatureClient': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#UnderlineFeatureClient': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#BoldFeatureClient': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#ItalicFeatureClient': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#LinkFeatureClient': [Function (anonymous)],
// //     //     'src/components/payload/AdminViews/Media/List/text#default': [Function: Test],
// //     //     'src/payload/collections/Orders/ui/LinkToPaymentIntent#default': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#HeadingFeatureClient': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#BlocksFeatureClient': [Function (anonymous)],
// //     //     '@payloadcms/richtext-lexical/client#UnorderedListFeatureClient': [Function (anonymous)],
// //     //     '@payload/fields/color/ui/#ColorSwatchComponent': [Function (anonymous)],
// //     //     'src/payload/collections/Products/ui/RowLabels/OptionLabel#default': [Function (anonymous)],
// //     //     'src/payload/collections/Products/ui/RowLabels/KeyLabel#default': [Function (anonymous)],
// //     //     'src/payload/collections/Products/ui/VariantSelect#default': [Function (anonymous)],
// //     //     'src/payload/collections/Products/ui/RowLabels/VariantLabel#default': [Function (anonymous)],
// //     //     '@payloadcms/plugin-seo/client#OverviewComponent': [Function (anonymous)],
// //     //     '@payloadcms/plugin-seo/client#MetaTitleComponent': [Function (anonymous)],
// //     //     '@payloadcms/plugin-seo/client#MetaImageComponent': [Function (anonymous)],
// //     //     '@payloadcms/plugin-seo/client#MetaDescriptionComponent': [Function (anonymous)],
// //     //     '@payloadcms/plugin-seo/client#PreviewComponent': [Function (anonymous)]
// //     //   },
// //     //   jobs: { queue: [AsyncFunction: queue], run: [AsyncFunction: run] },
// //     //   logger: EventEmitter {
// //     //     levels: [Object],
// //     //     silent: [Function: noop],
// //     //     onChild: [Function: noop],
// //     //     trace: [Function: noop],
// //     //     debug: [Function: noop],
// //     //     info: [Function: LOG],
// //     //     warn: [Function: LOG],
// //     //     error: [Function: LOG],
// //     //     fatal: [Function (anonymous)],
// //     //     [Symbol(pino.levelComp)]: [Function: bound compareLevel],
// //     //     [Symbol(pino.useOnlyCustomLevels)]: false,
// //     //     [Symbol(pino.stream)]: [Transform],
// //     //     [Symbol(pino.time)]: [Function: epochTime],
// //     //     [Symbol(pino.timeSliceIndex)]: 8,
// //     //     [Symbol(pino.stringify)]: [Function: stringify],
// //     //     [Symbol(pino.stringifySafe)]: [Function: stringify],
// //     //     [Symbol(pino.stringifiers)]: {},
// //     //     [Symbol(pino.end)]: '}\n',
// //     //     [Symbol(pino.formatOpts)]: [Object],
// //     //     [Symbol(pino.messageKey)]: 'msg',
// //     //     [Symbol(pino.errorKey)]: 'err',
// //     //     [Symbol(pino.nestedKey)]: null,
// //     //     [Symbol(pino.nestedKeyStr)]: '',
// //     //     [Symbol(pino.serializers)]: [Object],
// //     //     [Symbol(pino.mixin)]: undefined,
// //     //     [Symbol(pino.mixinMergeStrategy)]: undefined,
// //     //     [Symbol(pino.chindings)]: ',"pid":32708,"hostname":"MacBook-Pro.local"',
// //     //     [Symbol(pino.formatters)]: [Object],
// //     //     [Symbol(pino.hooks)]: [Object],
// //     //     [Symbol(pino.msgPrefix)]: undefined,
// //     //     [Symbol(pino.lsCache)]: [Object],
// //     //     [Symbol(pino.levelVal)]: 30
// //     //   },
// //     //   login: [AsyncFunction: login],
// //     //   resetPassword: [AsyncFunction: resetPassword],
// //     //   restoreGlobalVersion: [AsyncFunction: restoreGlobalVersion],
// //     //   restoreVersion: [AsyncFunction: restoreVersion],
// //     //   schema: undefined,
// //     //   secret: '124ff6f0a00cf0db7351177d3cecc743',
// //     //   sendEmail: [AsyncFunction: sendEmail],
// //     //   types: undefined,
// //     //   unlock: [AsyncFunction: unlock],
// //     //   updateGlobal: [AsyncFunction: updateGlobal],
// //     //   validationRules: undefined,
// //     //   verifyEmail: [AsyncFunction: verifyEmail],
// //     //   versions: {}
// //     // },
// //     permissions: {
// //       canAccessAdmin: true,
// //       collections: {
// //         address: [Object],
// //         'blog-categories': [Object],
// //         brands: [Object],
// //         testimonials: [Object],
// //         'payload-locked-documents': [Object],
// //         'payload-preferences': [Object],
// //         'payload-migrations': [Object],
// //         'shop-collections': [Object],
// //         'product-categories': [Object],
// //         redirects: [Object],
// //         'form-submissions': [Object],
// //         customers: [Object],
// //         users: [Object],
// //         media: [Object],
// //         cart: [Object],
// //         orders: [Object],
// //         'media-folders': [Object],
// //         posts: [Object],
// //         spas: [Object],
// //         forms: [Object],
// //         galleries: [Object],
// //         products: [Object],
// //         pages: [Object]
// //       },
// //       globals: {
// //         'shop-settings': [Object],
// //         'site-settings': [Object],
// //         footer: [Object],
// //         header: [Object]
// //       }
// //     },
// //     searchParams: { limit: '100' },
// //     user: {
// //       id: '66abd3a7baed989b327b92ae',
// //       name: 'Luke Gannon',
// //       email: 'luke.gannon@me.com',
// //       createdAt: '2024-08-01T18:27:51.358Z',
// //       updatedAt: '2024-11-26T19:58:24.905Z',
// //       cart: { items: [Array] },
// //       roles: [ 'customer', 'admin' ],
// //       stripeCustomerID: 'cus_Qfbzfp72nMwk4Q',
// //       purchases: [],
// //       firstName: 'Luke',
// //       lastName: 'Gannon',
// //       phone: '6476197477',
// //       loginAttempts: 0,
// //       collection: 'users',
// //       _strategy: 'local-jwt'
// //     },
// //     data: {
// //       docs: [
// //       ],
// //       totalDocs: 133,
// //       limit: 100,
// //       totalPages: 2,
// //       page: 1,
// //       pagingCounter: 1,
// //       hasPrevPage: false,
// //       hasNextPage: true,
// //       prevPage: null,
// //       nextPage: 2
// //     }
// //   }
