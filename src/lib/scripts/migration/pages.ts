import { readFile, writeFile } from 'fs/promises'
import Papa from 'papaparse'
import path from 'path'
import getPayload from '../../utils/getPayload'
import { PAGE_SLUG } from '@/payload/collections/constants'
import { BasePayload } from 'payload'
import { Page } from '@payload-types'
import { fileURLToPath } from 'url'

// Type definitions
interface IdMapping {
  [oldId: string]: number
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const CONFIG = {
  CSV_PATH: path.resolve('/Users/forrestdevs/downloads/test.pages.json'),
  ID_MAPPING_PATH: path.resolve(dirname, 'pages-id-mapping.json'),
}

const mediaIdMapping = JSON.parse(
  await readFile(path.resolve(dirname, 'media-id-mapping.json'), 'utf-8'),
) as IdMapping

const getMedia = (id: string) => {
  return mediaIdMapping[id] ?? null
}

async function createPageInPayload(record: PageRecord, payload: BasePayload) {
  try {
    payload.logger.info(`Creating page: ${record.title}`)

    const data: Omit<Page, 'id' | 'updatedAt' | 'createdAt' | 'sizes'> = {
      title: record.title ?? '',
      slug: record.slug,
      _status: record._status as Page['_status'],
      meta: {
        title: record.meta.title,
        description: record.meta.description,
        image: getMedia(record.meta.image ? record.meta.image.$oid : null),
      },
      hero: {
        title: record.hero.title,
        subtitle: record.hero.subtitle,
        type: record.hero.type as Page['hero']['type'],
        autoplay: record.hero.autoplay,
        background: getMedia(record.hero.background ? record.hero.background.toString() : null),
        delay: record.hero.delay,
        fade: record.hero.fade,
        links: record.hero.links
          ? record.hero.links.map((link) => {
              return {
                link: {
                  ...link.link,
                  type: 'custom',
                  reference: null,
                  url: '/home',
                },
              }
            })
          : [],
        size: record.hero.size as Page['hero']['size'],
        media: getMedia(record.hero.media ? record.hero.media.toString() : null) ?? 1,
        richText: record.hero.richText,
        slides: record.hero.slides
          ? record.hero.slides.map((slide) => ({
              ...slide,
              background: getMedia(slide.background ? slide.background.toString() : null),
              links: slide.links.map((link) => ({
                link: {
                  ...link.link,
                  type: 'custom',
                  reference: null,
                  url: '/home',
                },
              })),
            }))
          : [],
      },
      publishedAt: record.publishedAt.$date,
      // @ts-ignore
      layout: record.layout.map((layout) => {
        switch (layout.blockType) {
          case 'archive':
            return {
              ...layout,
              categories: [],
            }
          case 'banner':
            return {
              ...layout,
            }
          case 'cta':
            return {
              ...layout,
              links: layout.links?.map((link) => ({
                link: {
                  ...link.link,
                  type: 'custom',
                  reference: null,
                  url: '/home',
                },
              })),
            }
          case 'code':
            return {
              ...layout,
            }
          case 'content':
            return {
              ...layout,
              columns: layout.columns.map((column) => ({
                ...column,
                blocks: column?.blocks?.map((block) => {
                  switch (block.blockType) {
                    case 'mediaBlock':
                      return {
                        ...block,
                        media: getMedia(block.media ? block.media.toString() : null) ?? 1,
                      }
                    case 'typography':
                      return {
                        ...block,
                        body: block.body ?? null,
                        links: block.links?.map((link) => ({
                          link: {
                            ...link.link,
                            type: 'custom',
                            reference: null,
                            url: '/home',
                          },
                        })),
                      }
                    case 'grid':
                      return {
                        ...block,
                        content: block.content?.map((content) => ({
                          ...content,
                          blocks: content.blocks?.map((block) => ({
                            ...block,
                            // @ts-ignore
                            media: getMedia(block.media ? block.media.toString() : null) ?? 1,
                          })),
                        })),
                      }
                    default:
                      return block
                  }
                }),
                backgroundImage: getMedia(
                  column.backgroundImage ? column.backgroundImage.toString() : null,
                ),
                link: {
                  ...column.link,
                  type: 'custom',
                  reference: null,
                  url: '/home',
                },
              })),
            }
          case 'form':
            return {
              ...layout,
            }
          case 'mediaBlock':
            return {
              ...layout,
              relationTo: 'media',
              media: getMedia(layout.media ? layout.media.toString() : null),
            }
          case 'services':
            return {
              ...layout,
              link: {
                ...layout.link,
                type: 'custom',
                reference: null,
                url: '/home',
              },
              offerings: layout.offerings.map((offering) => ({
                ...offering,
                image: getMedia(offering.image ? offering.image.toString() : null) ?? 1,
                link: {
                  ...offering.link,
                  type: 'custom',
                  reference: null,
                  url: '/home',
                },
              })),
            }
          case 'testimonials':
            return {
              ...layout,
              link: {
                ...layout.link,
                type: 'custom',
                reference: null,
                url: '/contact',
              },
            }
          case 'contact':
            return {
              ...layout,
            }
          case 'typography':
            return {
              ...layout,
              links: layout.links?.map((link) => ({
                link: {
                  ...link.link,
                  type: 'custom',
                  reference: null,
                  url: '/home',
                },
              })),
            }
          case 'latest-posts':
            return {
              ...layout,
              posts: [],
              link: {
                ...layout.link,
                type: 'custom',
                reference: null,
                url: '/blog',
              },
            }
          case 'card':
            return {
              ...layout,
            }
          case 'grid':
            return {
              ...layout,
            }
          case 'featured-spas':
            return {}
          default:
            return layout
        }
      }),
    }

    const page = await payload.create({
      collection: PAGE_SLUG,
      data,
    })

    return page.id
  } catch (error) {
    console.error(`Error creating page for ${record.title}:`, error)
    throw error
  }
}

// const safeJSONParse = (str: string | null) => {
//   if (!str) return null
//   // Replace single quotes with double quotes, but handle escaped quotes properly
//   const doubleQuoted = str.replace(/(?<!\\)'/g, '"')
//   try {
//     return JSON.parse(doubleQuoted)
//   } catch (e) {
//     console.warn('Failed to parse JSON:', str)
//     return null
//   }
// }

// const safeJSONParseArray = (str: string | null) => {
//   if (!str) return []

//   // Helper to handle MongoDB/BSON specific types
//   const handleMongoTypes = (obj: any): any => {
//     if (!obj || typeof obj !== 'object') return obj

//     // Handle arrays
//     if (Array.isArray(obj)) {
//       return obj.map((item) => handleMongoTypes(item))
//     }

//     // Convert MongoDB/BSON types
//     const result: any = {}
//     for (const [key, value] of Object.entries(obj)) {
//       if (!value || typeof value !== 'object') {
//         result[key] = value
//         continue
//       }

//       // Handle special MongoDB types
//       if ('$numberInt' in value) {
//         result[key] = parseInt(value.$numberInt)
//       } else if ('$numberLong' in value) {
//         result[key] = parseInt(value.$numberLong)
//       } else if ('$date' in value) {
//         const dateValue = value.$date
//         if (typeof dateValue === 'object' && '$numberLong' in dateValue) {
//           result[key] = new Date(parseInt(dateValue.$numberLong)).toISOString()
//         } else {
//           result[key] = new Date(dateValue).toISOString()
//         }
//       } else if ('$oid' in value) {
//         result[key] = value.$oid
//       } else {
//         result[key] = handleMongoTypes(value)
//       }
//     }
//     return result
//   }

//   const cleanPythonObject = (input: string): string => {
//     try {
//       // Handle Python boolean/null literals first
//       let processed = input
//         .replace(/:\s*True\b/g, ': true')
//         .replace(/:\s*False\b/g, ': false')
//         .replace(/:\s*None\b/g, ': null')
//         .replace(/'\{/g, '{')
//         .replace(/\}'/g, '}')
//         .replace(/"\{/g, '{')
//         .replace(/\}"/g, '}')

//       // Handle nested quotes and string escaping
//       let inString = false
//       let result = ''
//       let i = 0

//       while (i < processed.length) {
//         const char = processed[i]
//         const nextChar = processed[i + 1]

//         if (char === "'" && processed[i - 1] !== '\\') {
//           if (!inString) {
//             result += '"'
//             inString = true
//           } else if (
//             nextChar === ':' ||
//             nextChar === ',' ||
//             nextChar === '}' ||
//             nextChar === ']' ||
//             nextChar === ' '
//           ) {
//             result += '"'
//             inString = false
//           } else {
//             result += "\\'"
//           }
//         } else if (char === '"' && !inString) {
//           inString = true
//           result += '"'
//         } else if (char === '"' && inString) {
//           inString = false
//           result += '"'
//         } else if (char === '\\' && nextChar === "'") {
//           result += "\\'"
//           i++ // Skip next character
//         } else {
//           result += char
//         }
//         i++
//       }

//       return result
//     } catch (e) {
//       console.error('Error in cleanPythonObject:', e)
//       return input
//     }
//   }

//   try {
//     // First attempt: Try parsing the cleaned string directly
//     const cleaned = cleanPythonObject(str)
//     let parsed = JSON.parse(cleaned)

//     // Handle the parsed data
//     parsed = handleMongoTypes(parsed)
//     return Array.isArray(parsed) ? parsed : [parsed]
//   } catch (firstError) {
//     try {
//       // Second attempt: Try wrapping in array and parsing
//       const wrapped = `[${cleanPythonObject(str)}]`
//       let parsed = JSON.parse(wrapped)

//       // Handle the parsed data
//       parsed = handleMongoTypes(parsed)
//       return Array.isArray(parsed) ? parsed : [parsed]
//     } catch (e) {
//       console.warn('Failed to parse JSON string:', str)
//       console.error('Parse error:', e)
//       return []
//     }
//   }
// }

type PageRecord = {
  _id: {
    $oid: string
  }
  title: string
  _status: string
  publishedAt: {
    $date: string
  }
  slug: string
  slugLock: boolean
  layout: Page['layout']
  hero: Page['hero']
  meta: {
    title: string
    description: string
    image: {
      $oid: string
    }
  }
}

async function processCsvFile(): Promise<void> {
  const payload = await getPayload()

  try {
    payload.logger.info('Starting pages migration...')

    // Read and parse JSON file
    const jsonContent = await readFile(CONFIG.CSV_PATH, 'utf-8')
    const data = JSON.parse(jsonContent) as PageRecord[]

    // Initialize ID mapping
    const idMapping: IdMapping = {}

    // Process each record
    for (const [index, record] of data.entries()) {
      try {
        payload.logger.info(`Processing ${index + 1}/${data.length}: ${record.title}`)
        const newId = await createPageInPayload(record, payload)
        idMapping[record._id.$oid] = newId
        console.log(JSON.stringify(newId, null, 2), '\n\n')
      } catch (error) {
        console.error(`Failed to process record ${record.title}:`, error)
      }
    }

    // Write ID mapping to file
    await writeFile(CONFIG.ID_MAPPING_PATH, JSON.stringify(idMapping, null, 2), 'utf-8')
    payload.logger.info('Pages migration complete!')
    payload.logger.info(`ID mapping saved to: ${CONFIG.ID_MAPPING_PATH}`)
  } catch (error) {
    console.error('Failed to process CSV:', error)
  }
}

processCsvFile()
  .catch((error) => {
    console.error('Unhandled promise rejection:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
