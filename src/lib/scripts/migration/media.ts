import { readFile, writeFile } from 'fs/promises'
import Papa from 'papaparse'
import path from 'path'
import getPayload from '../../utils/getPayload'
import { MEDIA_SLUG } from '@/payload/collections/constants'
import { BasePayload } from 'payload'
import { Media } from '@payload-types'
import { media } from '@/payload-generated-schema'
import { fileURLToPath } from 'url'
// Type definitions
interface IdMapping {
  [oldId: string]: number
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const CONFIG = {
  CSV_PATH: path.resolve('/Users/forrestdevs/dev/db/csv_output/media.csv'),
  ID_MAPPING_PATH: path.resolve(dirname, 'media-id-mapping.json'),
}

async function createMediaInPayload(record: MediaRecord, payload: BasePayload): Promise<number> {
  try {
    payload.logger.info(`Creating media: ${record.filename}`)

    const data: Partial<Media> = {
      alt: record.alt,
      filename: record.filename,
      filesize: record.filesize,
      focalX: record.focalX,
      focalY: record.focalY,
      height: record.height,
      mimeType: record.mimeType,
      prefix: 'bonavista/',
      sizes: {
        thumbnail: {
          filename: record.sizes_thumbnail_filename,
          filesize: record.sizes_thumbnail_filesize,
          height: record.sizes_thumbnail_height,
          mimeType: record.sizes_thumbnail_mimeType,
          url: record.sizes_thumbnail_url,
          width: record.sizes_thumbnail_width,
        },
      },
      thumbnailURL: record.thumbnailURL,
      url: record.url,
      width: record.width,
    }

    const media = await payload.db.create({
      collection: MEDIA_SLUG,
      data,
    })

    return media.id
  } catch (error) {
    console.error(`Error creating media for ${record.filename}:`, error)
    throw error
  }
}

type MediaRecord = {
  __v: number
  _id: string
  alt: string
  createdAt: string
  filename: string
  filesize: number
  focalX: number
  focalY: number
  folder: null
  height: number
  mimeType: string
  prefix: string
  sizes_thumbnail_filename: string
  sizes_thumbnail_filesize: number
  sizes_thumbnail_height: number
  sizes_thumbnail_mimeType: string
  sizes_thumbnail_url: string
  sizes_thumbnail_width: number
  thumbnailURL: string
  updatedAt: string
  url: string
  width: number
}

async function processCsvFile(): Promise<void> {
  const payload = await getPayload()

  try {
    payload.logger.info('Starting media migration...')

    // Read and parse CSV
    const csvContent = await readFile(CONFIG.CSV_PATH, 'utf-8')
    const { data } = Papa.parse<MediaRecord>(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    })

    // Initialize ID mapping
    const idMapping: IdMapping = {}

    // Process each record
    for (const [index, record] of data.entries()) {
      try {
        payload.logger.info(`Processing ${index + 1}/${data.length}: ${record.filename}`)
        const newId = await createMediaInPayload(record, payload)
        idMapping[record._id] = newId
      } catch (error) {
        console.error(`Failed to process record ${record.filename}:`, error)
      }
    }

    // Write ID mapping to file
    await writeFile(CONFIG.ID_MAPPING_PATH, JSON.stringify(idMapping, null, 2), 'utf-8')

    payload.logger.info('Media migration complete!')
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
