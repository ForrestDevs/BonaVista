import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import getPayload from '../../utils/getPayload'
import { SPA_SLUG, TESTIMONIALS_SLUG } from '@/payload/collections/constants'
import { BasePayload } from 'payload'
import { Spa, Testimonial } from '@payload-types'
import { fileURLToPath } from 'url'

// Type definitions
interface IdMapping {
  [oldId: string]: number
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const CONFIG = {
  CSV_PATH: path.resolve('/Users/forrestdevs/downloads/test.testimonials.json'),
}

type ReviewRecord = {
  title: string
  content: string
  author: string
  rating: number
  date: {
    $date: string
  }
}

const mediaIdMapping = JSON.parse(
  await readFile(path.resolve(dirname, 'media-id-mapping.json'), 'utf-8'),
) as IdMapping

const getMedia = (id: string) => {
  return mediaIdMapping[id] ?? null
}

async function createSpaInPayload(record: ReviewRecord, payload: BasePayload) {
  try {
    payload.logger.info(`Creating spa: ${record.title}`)

    const recordDate = new Date(record.date.$date).toISOString()

    await payload.create({
      collection: TESTIMONIALS_SLUG,
      data: {
        title: record.title,
        content: record.content,
        author: record.author,
        rating: record.rating,
        date: recordDate,
      },
    })
  } catch (error) {
    console.error(`Error creating review for ${record.title}:`, error)
    throw error
  }
}

async function processJSONFile(): Promise<void> {
  const payload = await getPayload()

  try {
    payload.logger.info('Starting media migration...')

    // Read and parse CSV
    const jsonContent = await readFile(CONFIG.CSV_PATH, 'utf-8')
    const data = JSON.parse(jsonContent) as ReviewRecord[]

    // Initialize ID mapping
    const idMapping: IdMapping = {}

    // Process each record
    for (const [index, record] of data.entries()) {
      try {
        payload.logger.info(`Processing ${index + 1}/${data.length}: ${record.title}`)
        await createSpaInPayload(record, payload)
      } catch (error) {
        console.error(`Failed to process record ${record.title}:`, error)
      }
    }

    payload.logger.info('Testimonials migration complete!')
  } catch (error) {
    console.error('Failed to process CSV:', error)
  }
}

processJSONFile()
  .catch((error) => {
    console.error('Unhandled promise rejection:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
