import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import getPayload from '../../utils/getPayload'
import { SPA_SLUG } from '@/payload/collections/constants'
import { BasePayload } from 'payload'
import { Spa } from '@payload-types'
import { fileURLToPath } from 'url'

// Type definitions
interface IdMapping {
  [oldId: string]: number
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const CONFIG = {
  CSV_PATH: path.resolve('/Users/forrestdevs/downloads/test.spas.json'),
  ID_MAPPING_PATH: path.resolve(dirname, 'spas-id-mapping.json'),
}

type SpaRecord = {
  _id: {
    $oid: string
  }
  slug: string
  slugLock: boolean
  type: 'hot-tub' | 'swim-spa'
  hotTubCollection: 'self-cleaning' | 'serenity'
  swimSpaCollection: 'executive-trainer' | 'aqua-trainer' | 'aqua-sport' | 'aqua-play'
  title: string
  startingPrice: number
  modelYear: number
  model: string
  description: string
  seatingDesign: string
  seating: string
  jets: string
  volume: string
  swimSystem: string
  sizeCategory: string
  energyEfficiency: number
  hydroGuide: string
  dimensions: string
  height: string
  weightFull: string
  weightEmpty: string
  swimArea: string
  jetPumps: string
  interiorLighting: string
  exteriorLighting: string
  waterFalls: string
  selfCleaning: boolean
  circulationPump: boolean
  automatedWellness: boolean
  pureWaterSystem: 'optional' | 'standard'
  ezZonePure: 'optional' | 'standard'
  oasisPackage: 'optional' | 'not-available'
  hydroFlex: 'optional' | 'not-available'
  iCommand: 'optional' | 'not-available'
  northernFalls: 'optional' | 'not-available'
  chromatherapy: 'optional' | 'not-available'
  heater: 'optional' | 'not-available'
  warranty: string
  thumbnail: {
    $oid: string
  }
  topdown: {
    $oid: string
  }
  threeDModel: string
  createdAt: {
    $date: string
  }
  updatedAt: {
    $date: string
  }
  meta: {
    title: string
    image: {
      $oid: string
    }
    description: string
  }
}

const mediaIdMapping = JSON.parse(
  await readFile(path.resolve(dirname, 'media-id-mapping.json'), 'utf-8'),
) as IdMapping

const getMedia = (id: string) => {
  return mediaIdMapping[id] ?? null
}

async function createSpaInPayload(record: SpaRecord, payload: BasePayload): Promise<number> {
  try {
    payload.logger.info(`Creating spa: ${record.title}`)

    const data: Omit<Spa, 'id' | 'updatedAt' | 'createdAt'> = {
      slug: record.slug,
      slugLock: record.slugLock,
      type: record.type,
      hotTubCollection: record.hotTubCollection,
      swimSpaCollection: record.swimSpaCollection,
      title: record.title,
      startingPrice: record.startingPrice,
      modelYear: 2025,
      model: record.model,
      description: record.description,
      seatingDesign: record.seatingDesign,
      seating: record.seating,
      jets: record.jets,
      volume: record.volume,
      swimSystem: record.swimSystem,
      sizeCategory: record.sizeCategory,
      energyEfficiency: record.energyEfficiency,
      hydroGuide: record.hydroGuide,
      dimensions: record.dimensions,
      height: record.height,
      weightFull: record.weightFull,
      weightEmpty: record.weightEmpty,
      swimArea: record.swimArea,
      jetPumps: record.jetPumps,
      interiorLighting: record.interiorLighting,
      exteriorLighting: record.exteriorLighting,
      waterFalls: record.waterFalls,
      selfCleaning: record.selfCleaning,
      circulationPump: record.circulationPump,
      automatedWellness: record.automatedWellness,
      pureWaterSystem: record.pureWaterSystem,
      ezZonePure: record.ezZonePure,
      oasisPackage: record.oasisPackage,
      hydroFlex: record.hydroFlex,
      iCommand: record.iCommand,
      northernFalls: record.northernFalls,
      chromatherapy: record.chromatherapy,
      heater: record.heater,
      warranty: record.warranty,
      thumbnail: getMedia(record.thumbnail.$oid),
      topdown: getMedia(record.topdown.$oid),
      threeDModel: record.threeDModel,
      meta: {
        title: record.meta.title,
        image: getMedia(record.meta.image.$oid),
        description: record.meta.description,
      },
    }

    const spa = await payload.create({
      collection: SPA_SLUG,
      data,
    })

    return spa.id
  } catch (error) {
    console.error(`Error creating spa for ${record.title}:`, error)
    throw error
  }
}

async function processJSONFile(): Promise<void> {
  const payload = await getPayload()

  try {
    payload.logger.info('Starting media migration...')

    // Read and parse CSV
    const jsonContent = await readFile(CONFIG.CSV_PATH, 'utf-8')
    const data = JSON.parse(jsonContent) as SpaRecord[]

    // Initialize ID mapping
    const idMapping: IdMapping = {}

    // Process each record
    for (const [index, record] of data.entries()) {
      try {
        payload.logger.info(`Processing ${index + 1}/${data.length}: ${record.title}`)
        const newId = await createSpaInPayload(record, payload)
        idMapping[record._id.$oid] = newId
      } catch (error) {
        console.error(`Failed to process record ${record.title}:`, error)
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

processJSONFile()
  .catch((error) => {
    console.error('Unhandled promise rejection:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
